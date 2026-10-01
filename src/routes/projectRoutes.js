const express = require("express");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PROJECT ROUTES
// ==========================================

// Create Project
router.post("/", protect, createProject);

// Get All Projects
router.get("/", protect, getProjects);

// Update Project
router.put("/:id", protect, updateProject);

// Delete Project
router.delete("/:id", protect, deleteProject);

module.exports = router;