const Notification = require("../models/Notification");

// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification = async ({
  userId,
  type = "SYSTEM",
  title,
  message,
  taskId = null,
  projectId = null,
}) => {
  try {
    if (!userId || !title || !message) {
      console.error(
        "Notification: userId, title and message are required"
      );

      return null;
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      taskId,
      projectId,
    });

    return notification;
  } catch (error) {
    console.error(
      "Create notification error:",
      error.message
    );

    // Notification fail झाली तरी
    // main task operation fail होऊ नये.
    return null;
  }
};

// ==========================================
// TASK ASSIGNED NOTIFICATION
// ==========================================

const notifyTaskAssigned = async ({
  userId,
  taskId,
  taskTitle,
}) => {
  return createNotification({
    userId,
    type: "TASK_ASSIGNED",
    title: "Task Assigned",
    message: `You have been assigned to task "${taskTitle}".`,
    taskId,
  });
};

// ==========================================
// TASK UNASSIGNED NOTIFICATION
// ==========================================

const notifyTaskUnassigned = async ({
  userId,
  taskId,
  taskTitle,
}) => {
  return createNotification({
    userId,
    type: "TASK_UNASSIGNED",
    title: "Task Unassigned",
    message: `You have been unassigned from task "${taskTitle}".`,
    taskId,
  });
};

// ==========================================
// TASK UPDATED NOTIFICATION
// ==========================================

const notifyTaskUpdated = async ({
  userId,
  taskId,
  taskTitle,
}) => {
  return createNotification({
    userId,
    type: "TASK_UPDATED",
    title: "Task Updated",
    message: `Task "${taskTitle}" has been updated.`,
    taskId,
  });
};

// ==========================================
// COMMENT NOTIFICATION
// ==========================================

const notifyCommentAdded = async ({
  userId,
  taskId,
  taskTitle,
}) => {
  return createNotification({
    userId,
    type: "COMMENT_ADDED",
    title: "New Comment",
    message: `A new comment was added to task "${taskTitle}".`,
    taskId,
  });
};

module.exports = {
  createNotification,
  notifyTaskAssigned,
  notifyTaskUnassigned,
  notifyTaskUpdated,
  notifyCommentAdded,
};