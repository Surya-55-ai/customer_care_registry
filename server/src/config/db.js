const mongoose = require("mongoose");

// Same local database Compass connects to (mongodb://localhost:27017)
// with a dedicated database name so it's easy to find in Compass.
const db = process.env.MONGO_URI || "mongodb://localhost:27017/customer_care_registry";

const connectDB = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection successful");
    })
    .catch((e) => {
      console.log(`No connection: ${e}`);
    });
};

module.exports = connectDB;

// mongodb://localhost:27017
