const express = require("express");

const app = express();
const PORT = 3000;

// Custom middleware
function addUser(req, res, next) {
  req.user = "Guest";
  next();
}

// Apply middleware only to /welcome
app.get("/welcome", addUser, (req, res) => {
  res.send(`<h1>Welcome, ${req.user}!</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});