const mongoose = require("mongoose");

const agentNotificationSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentNotification", agentNotificationSchema);
