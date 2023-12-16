const { Client } = require('pg'); // postgresql client for nodejs (used vercel db for postgresql)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// middlewares for proper functioning of the server 
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors()) // to allow cross origin requests

// Database connection with environment variables
const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect(); // connect to the database

// API endpoints

// GET request to fetch all the categories from the database
app.get('/api/categories', (req, res) => {
    client.query('SELECT * from categories', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(result.rows);
    });
});

// GET request to fetch all the products or products which match the category to query param category
app.get('/api/products', (req, res) => {
    const category = req.query.category;

    // If category is present in the query params, fetch products which match the category
    if (category) {
        client.query('SELECT * from products WHERE category = $1', [category], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            res.send(result.rows);
        });
    } 
    // If category is not present in the query params, fetch all the products
    else {
        client.query('SELECT * from products', (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            res.send(result.rows);
        });
    }
}
);

// POST request to add a new product to the database
app.post('/api/products', (req, res) => {
    const { name, rate, category } = req.body;

    // Fetch the gst of the category to which the product is being added
    client.query('SELECT gst from categories WHERE name = $1', [category], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        const gst = result.rows[0].gst;
        // Insert the product into the database
        client.query('INSERT INTO products(product, category, gst, rate) VALUES($1, $2, $3, $4)', [name, category, gst, rate], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            res.send(result.rows);
        });
    });
}
);

// POST request to add a new category to the database
app.post('/api/category', (req, res) => {
    const { name,gst } = req.body;
    client.query('INSERT INTO categories(name, gst) VALUES($1, $2)', [name, gst], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(result.rows);
    });
});

// GET request to fetch all the invoices from the database
app.get('/*', (req, res) => {
    res.send('No routes to this address');
}
);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
