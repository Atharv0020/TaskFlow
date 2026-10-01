const express = require("express");

const {
  getTaskActivities,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ACTIVITY ROUTES
// ==========================================

// Get Task Activity History
// GET /api/tasks/:id/activities

router.get(
  "/tasks/:id/activities",
  protect,
  getTaskActivities
);

module.exports = router;