const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connecttoDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const cookieparser = require("cookie-parser");

connecttoDB(); // Connect to MongoDB
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use(cookieparser()); // Middleware to parse cookies

// Register user routes with the '/users' prefix
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
