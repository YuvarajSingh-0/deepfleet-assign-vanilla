const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/api/addproducts', (req, res) => {
    const { name, rate, category } = req.body;
    
}
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
