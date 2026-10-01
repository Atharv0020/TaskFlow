const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  assignUserToTask,
  unassignUserFromTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// TASK ROUTES
// ==========================================

// Create Task
router.post("/", protect, createTask);

// Get All Tasks
router.get("/", protect, getTasks);

// Get Single Task
router.get("/:id", protect, getTaskById);

// Assign User
router.put("/:id/assign", protect, assignUserToTask);

// Unassign User
router.put("/:id/unassign", protect, unassignUserFromTask);

// Update Task
router.put("/:id", protect, updateTask);

// Delete Task
router.delete("/:id", protect, deleteTask);

module.exports = router;