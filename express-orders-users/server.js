const express = require("express");

const app = express();
const PORT = 3000;

// Orders
app.get("/orders", (req, res) => {
    res.send("Here is the list of all orders.");
});

app.post("/orders", (req, res) => {
    res.send("A new order has been created.");
});

// Users
app.get("/users", (req, res) => {
    res.send("Here is the list of all users.");
});

app.post("/users", (req, res) => {
    res.send("A new user has been added.");
});

// Dynamic route
app.get("/welcome/:username", (req, res) => {
    const username = req.params.username;
    const role = req.query.role;

    res.send(`Welcome ${username}, your role is ${role}`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});