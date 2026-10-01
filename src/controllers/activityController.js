const mongoose = require("mongoose");

const Activity = require("../models/Activity");
const Task = require("../models/Task");

// ==========================================
// GET TASK ACTIVITIES
// GET /api/tasks/:id/activities
// ==========================================

const getTaskActivities = async (req, res) => {
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

    // Get activities
    const activities = await Activity.find({
      taskId: id,
    })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Task activities fetched successfully",
      data: {
        activities,
        count: activities.length,
      },
    });
  } catch (error) {
    console.error("Get task activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task activities",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE ACTIVITY
// Internal reusable function
// ==========================================

const createActivity = async ({
  taskId,
  userId,
  action,
  description,
  oldValue = null,
  newValue = null,
}) => {
  try {
    if (
      !taskId ||
      !userId ||
      !action ||
      !description
    ) {
      throw new Error("Required activity fields are missing");
    }

    const activity = await Activity.create({
      taskId,
      userId,
      action,
      description,
      oldValue,
      newValue,
    });

    return activity;
  } catch (error) {
    console.error("Create activity error:", error);
    throw error;
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getTaskActivities,
  createActivity,
};