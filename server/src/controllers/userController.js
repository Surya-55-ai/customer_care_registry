const Customer = require("../models/Customer");

// @route  GET /api/users/me
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @route  GET /api/users        (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await Customer.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await Customer.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, userName } = req.body;

    if (req.user._id.toString() !== req.params.id && req.user.type !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this user" });
    }

    const user = await Customer.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, userName },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/users/:id  (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await Customer.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, getAllUsers, getUserById, updateUser, deleteUser };
