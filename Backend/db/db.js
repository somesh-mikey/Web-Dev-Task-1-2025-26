// filepath: c:\Users\Somesh Das\Documents\Frontend Batch\Projects\Uber Video\Backend\db\db.js
const mongoose = require("mongoose");

function connecttoDB() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = connecttoDB;
