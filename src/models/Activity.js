const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "TASK_CREATED",
        "TASK_UPDATED",
        "STATUS_CHANGED",
        "PRIORITY_CHANGED",
        "USER_ASSIGNED",
        "USER_UNASSIGNED",
        "COMMENT_ADDED",
        "COMMENT_UPDATED",
        "COMMENT_DELETED",
        "TASK_DELETED",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    oldValue: {
      type: String,
      default: null,
    },

    newValue: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Faster activity history queries
activitySchema.index({
  taskId: 1,
  createdAt: -1,
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;