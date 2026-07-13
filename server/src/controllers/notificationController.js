const Notification = require("../models/Notification");
const AgentNotification = require("../models/AgentNotification");
const Agent = require("../models/Agent");

// @route  GET /api/notifications        (customer/user notifications)
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/notifications/agent    (agent notifications)
const getMyAgentNotifications = async (req, res) => {
  try {
    const agent = await Agent.findOne({ customer: req.user._id });
    if (!agent) return res.status(404).json({ message: "Agent profile not found" });

    const notifications = await AgentNotification.find({ agent: agent._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/notifications/agent/:id/read
const markAgentNotificationAsRead = async (req, res) => {
  try {
    const notification = await AgentNotification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  getMyAgentNotifications,
  markAsRead,
  markAgentNotificationAsRead,
};
