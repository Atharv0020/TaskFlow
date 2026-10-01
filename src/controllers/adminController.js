const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

// ==========================================
// GET ADMIN STATS
// ==========================================

const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProjects = await Project.countDocuments();

    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        projects: totalProjects,
        tasks: totalTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE USER ROLE
// ==========================================

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const allowedRoles = [
      "ADMIN",
      "MANAGER",
      "MEMBER",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (
      req.user &&
      req.user._id &&
      req.user._id.toString() === userId
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};