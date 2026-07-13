const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.use(protect);

router.post("/", sendMessage);
router.get("/:complaintId", getMessages);

module.exports = router;
