const Complaint = require("../models/Complaint");
const Agent = require("../models/Agent");
const Notification = require("../models/Notification");
const AgentNotification = require("../models/AgentNotification");

// @route  POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { name, phone, email, category, details } = req.body;

    if (!name || !phone || !email || !details) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const complaint = await Complaint.create({
      customer: req.user._id,
      name,
      phone,
      email,
      category: category || undefined,
      details,
    });

    await Notification.create({
      customer: req.user._id,
      complaint: complaint._id,
      message: "Your complaint has been registered and is pending review.",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/complaints/mine
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ customer: req.user._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/complaints        (admin/agent)
const getAllComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.user.type === "agent") {
      const agent = await Agent.findOne({ customer: req.user._id });
      if (agent) filter.agent = agent._id;
    }

    const complaints = await Complaint.find(filter)
      .populate("customer", "firstName lastName email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("customer", "firstName lastName email")
      .populate("category", "name")
      .populate({ path: "agent", populate: { path: "customer", select: "firstName lastName" } });

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/complaints/:id/assign     (admin only)
const assignAgent = async (req, res) => {
  try {
    const { agentId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { agent: agentId, status: "in-progress" },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await AgentNotification.create({
      agent: agentId,
      complaint: complaint._id,
      message: `A new complaint (#${complaint._id.toString().slice(-6)}) has been assigned to you.`,
    });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/complaints/:id/status     (admin/agent)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await Notification.create({
      customer: complaint.customer,
      complaint: complaint._id,
      message: `Your complaint status has been updated to "${status}".`,
    });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  assignAgent,
  updateStatus,
};
