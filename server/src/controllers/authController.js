const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Agent = require("../models/Agent");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, type } = req.body;

    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existing = await Customer.findOne({ $or: [{ email }, { userName }] });
    if (existing) {
      return res.status(400).json({ message: "Email or username already registered" });
    }

    const validTypes = ["admin", "user", "agent"];
    const role = validTypes.includes(type) ? type : "user";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      type: role,
    });

    if (role === "agent") {
      await Agent.create({ customer: customer._id });
    }

    const token = generateToken(customer._id);

    res.status(201).json({
      token,
      user: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        userName: customer.userName,
        email: customer.email,
        type: customer.type,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(customer._id);

    res.status(200).json({
      token,
      user: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        userName: customer.userName,
        email: customer.email,
        type: customer.type,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
