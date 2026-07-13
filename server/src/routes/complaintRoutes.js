const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  assignAgent,
  updateStatus,
} = require("../controllers/complaintController");

router.use(protect);

router.post("/", createComplaint);
router.get("/mine", getMyComplaints);
router.get("/", restrictTo("admin", "agent"), getAllComplaints);
router.get("/:id", getComplaintById);
router.put("/:id/assign", restrictTo("admin"), assignAgent);
router.put("/:id/status", restrictTo("admin", "agent"), updateStatus);

module.exports = router;
