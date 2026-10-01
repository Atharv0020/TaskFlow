const express = require("express");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE COMMENT
// POST /api/tasks/:id/comments
// ==========================================

router.post("/tasks/:id/comments", protect, createComment);

// ==========================================
// GET COMMENTS
// GET /api/tasks/:id/comments
// ==========================================

router.get("/tasks/:id/comments", protect, getComments);

// ==========================================
// UPDATE COMMENT
// PUT /api/comments/:commentId
// ==========================================

router.put("/comments/:commentId", protect, updateComment);

// ==========================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ==========================================

router.delete("/comments/:commentId", protect, deleteComment);

module.exports = router;