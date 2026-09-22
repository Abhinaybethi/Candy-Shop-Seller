const express = require("express");

const app = express();
const PORT = 4000;

const productRouter = require("./routes/products");
const userRouter = require("./routes/users");

app.use("/products", productRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});