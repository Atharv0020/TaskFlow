const mongoose = require("mongoose");

const Comment = require("../models/Comment");
const Task = require("../models/Task");

// ==========================================
// CREATE COMMENT
// POST /api/tasks/:id/comments
// ==========================================

const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate Task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Check Task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Create Comment
    const comment = await Comment.create({
      taskId: id,
      userId: req.user.id,
      content: content.trim(),
    });

    // Populate user details
    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "name email role")
      .populate("taskId", "title");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment: populatedComment,
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message,
    });
  }
};

// ==========================================
// GET COMMENTS
// GET /api/tasks/:id/comments
// ==========================================

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Check Task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Get comments
    const comments = await Comment.find({
      taskId: id,
    })
      .populate("userId", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: {
        comments,
        count: comments.length,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE COMMENT
// PUT /api/comments/:commentId
// ==========================================

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    // Validate Comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own comments",
      });
    }

    comment.content = content.trim();

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("userId", "name email role")
      .populate("taskId", "title");

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: {
        comment: updatedComment,
      },
    });
  } catch (error) {
    console.error("Update comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update comment",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ==========================================

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Validate Comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};