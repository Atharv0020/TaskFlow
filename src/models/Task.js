const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters"],
      maxlength: [150, "Task title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
      index: true,
    },

    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },

    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"],
      default: "TODO",
      index: true,
    },

    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful compound indexes for filtering and sorting
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ projectId: 1, priority: 1 });
taskSchema.index({ assignedUser: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;