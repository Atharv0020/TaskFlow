const Notification = require("../models/Notification");

// ==========================================
// GET NOTIFICATIONS
// ==========================================

const getNotifications = async (req, res, next) => {
  try {
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      parseInt(req.query.limit) || 20,
      100
    );

    const skip = (page - 1) * limit;

    const filter = {
      userId: req.user._id,
    };

    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const [notifications, total] =
      await Promise.all([
        Notification.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        Notification.countDocuments(filter),
      ]);

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET UNREAD COUNT
// ==========================================

const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount =
      await Notification.countDocuments({
        userId: req.user._id,
        isRead: false,
      });

    res.status(200).json({
      success: true,
      message:
        "Unread notification count fetched successfully",
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MARK AS READ
// ==========================================

const markAsRead = async (req, res, next) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE NOTIFICATION
// ==========================================

const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};