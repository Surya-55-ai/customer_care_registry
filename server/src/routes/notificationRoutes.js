const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  getMyAgentNotifications,
  markAsRead,
  markAgentNotificationAsRead,
} = require("../controllers/notificationController");

router.use(protect);

router.get("/", getMyNotifications);
router.get("/agent", getMyAgentNotifications);
router.put("/:id/read", markAsRead);
router.put("/agent/:id/read", markAgentNotificationAsRead);

module.exports = router;
