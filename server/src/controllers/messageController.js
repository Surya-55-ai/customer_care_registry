const Communication = require("../models/Communication");
const Complaint = require("../models/Complaint");

// @route  POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { complaintId, message } = req.body;

    if (!complaintId || !message) {
      return res.status(400).json({ message: "complaintId and message are required" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const senderType = req.user.type === "agent" ? "agent" : "user";

    const communication = await Communication.create({
      complaint: complaintId,
      sender: req.user._id,
      senderType,
      message,
    });

    res.status(201).json(communication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/messages/:complaintId
const getMessages = async (req, res) => {
  try {
    const messages = await Communication.find({ complaint: req.params.complaintId })
      .populate("sender", "firstName lastName userName")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };
