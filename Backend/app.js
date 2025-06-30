const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connecttoDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");

connecttoDB(); // Connect to MongoDB
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use(cookieparser()); // Middleware to parse cookies

// Enable CORS allowing requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    credentials: true,
  })
);

// Register user routes with the '/users' prefix
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/captains", captainRoutes); // Register captain routes with the '/captains' prefix
app.use("/maps", mapsRoutes); // Register map routes with the '/maps' prefix
app.use("/rides", rideRoutes); // Register ride routes with the '/rides' prefix

module.exports = app;
