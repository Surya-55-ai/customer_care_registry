const Agent = require("../models/Agent");
const Complaint = require("../models/Complaint");

// @route  GET /api/agents        (admin only)
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().populate(
      "customer",
      "firstName lastName userName email"
    );
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/agents/me     (logged-in agent's own dashboard profile)
const getMyAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findOne({ customer: req.user._id }).populate(
      "customer",
      "firstName lastName userName email"
    );
    if (!agent) return res.status(404).json({ message: "Agent profile not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/agents/:id
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate(
      "customer",
      "firstName lastName userName email"
    );
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/agents/refresh-stats/:id
// Recalculates solved/pending complaint counts for an agent
const refreshStats = async (req, res) => {
  try {
    const agentId = req.params.id;
    const totalSolved = await Complaint.countDocuments({ agent: agentId, status: "resolved" });
    const totalPending = await Complaint.countDocuments({
      agent: agentId,
      status: { $in: ["pending", "in-progress"] },
    });

    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { totalSolved, totalPending },
      { new: true }
    ).populate("customer", "firstName lastName userName email");

    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAgents, getMyAgentProfile, getAgentById, refreshStats };
