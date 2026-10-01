const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get notifications
router.get("/", protect, getNotifications);

// Get unread count
router.get("/unread-count", protect, getUnreadCount);

// Mark notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all as read
router.put("/read-all", protect, markAllAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;