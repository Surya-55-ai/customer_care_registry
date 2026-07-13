const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getAllAgents,
  getMyAgentProfile,
  getAgentById,
  refreshStats,
} = require("../controllers/agentController");

router.use(protect);

router.get("/", restrictTo("admin"), getAllAgents);
router.get("/me", restrictTo("agent"), getMyAgentProfile);
router.get("/:id", getAgentById);
router.put("/refresh-stats/:id", restrictTo("admin", "agent"), refreshStats);

module.exports = router;
