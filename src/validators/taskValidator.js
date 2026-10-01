const mongoose = require("mongoose");

const allowedPriorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const allowedStatuses = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
];

const validateCreateTask = (req, res, next) => {
  const {
    title,
    projectId,
    assignedUser,
    priority,
    status,
    dueDate,
  } = req.body;

  const errors = [];

  if (!title || !title.trim()) {
    errors.push("Task title is required");
  }

  if (title && title.trim().length > 200) {
    errors.push("Task title cannot exceed 200 characters");
  }

  if (!projectId) {
    errors.push("Project ID is required");
  } else if (
    !mongoose.Types.ObjectId.isValid(projectId)
  ) {
    errors.push("Invalid project ID");
  }

  if (
    assignedUser &&
    !mongoose.Types.ObjectId.isValid(assignedUser)
  ) {
    errors.push("Invalid assigned user ID");
  }

  if (
    priority &&
    !allowedPriorities.includes(priority)
  ) {
    errors.push("Invalid priority");
  }

  if (
    status &&
    !allowedStatuses.includes(status)
  ) {
    errors.push("Invalid task status");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateUpdateTask = (req, res, next) => {
  const {
    title,
    projectId,
    assignedUser,
    priority,
    status,
  } = req.body;

  const errors = [];

  if (title !== undefined && !title.trim()) {
    errors.push("Task title cannot be empty");
  }

  if (
    title &&
    title.trim().length > 200
  ) {
    errors.push("Task title cannot exceed 200 characters");
  }

  if (
    projectId &&
    !mongoose.Types.ObjectId.isValid(projectId)
  ) {
    errors.push("Invalid project ID");
  }

  if (
    assignedUser &&
    !mongoose.Types.ObjectId.isValid(assignedUser)
  ) {
    errors.push("Invalid assigned user ID");
  }

  if (
    priority &&
    !allowedPriorities.includes(priority)
  ) {
    errors.push("Invalid priority");
  }

  if (
    status &&
    !allowedStatuses.includes(status)
  ) {
    errors.push("Invalid task status");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};