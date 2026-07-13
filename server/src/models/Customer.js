const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    type: {
      type: String,
      enum: ["admin", "user", "agent"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
