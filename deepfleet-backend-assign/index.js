const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors())

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

client.connect();

app.get('/api/categories', (req, res) => {
    client.query('SELECT * from categories', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(result.rows);
    });
});

app.get('/api/products', (req, res) => {
    const category = req.query.category;
    if (category) {
        client.query('SELECT * from products WHERE category = $1', [category], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            res.send(result.rows);
        });
    } else {
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

app.post('/api/products', (req, res) => {
    const { name, rate, category } = req.body;
    client.query('SELECT gst from categories WHERE name = $1', [category], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        const gst = result.rows[0].gst;
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


app.get('/', (req, res) => {
    client.query('SELECT * from products', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(result.rows);
    });
});

app.get('/*', (req, res) => {
    res.send('404');
}
);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
