const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      totalProjects,
      totalUsers,
      totalComments,
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "COMPLETED" }),
      Task.countDocuments({ status: "IN_PROGRESS" }),
      Project.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        summary: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          totalProjects,
          totalUsers,
          totalComments,
        },
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};