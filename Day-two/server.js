const express = require("express");

const app = express();

app.use(express.json());

const products = [
    {
        id: 1,
        name: "Apple TV",
        brand: "Apple",
        price: 50000
    },
    {
        id: 2,
        name: "Realme Narzo 20",
        brand: "Realme",
        price: 20000
    }
];

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.post("/api/products", (req, res) => {

    const { name, brand, price } = req.body;

    const product = {
        id: products.length + 1,
        name,
        brand,
        price
    };

    products.push(product);

    res.status(201).json(product);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});