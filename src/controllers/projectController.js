const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

// ==========================================
// CREATE PROJECT
// ==========================================

const createProject = async (req, res) => {
  try {
    const { title, description, members, status } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    // Validate members
    if (members && !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Members must be an array",
      });
    }

    // Check whether members exist
    if (members && members.length > 0) {
      const validMembers = await User.countDocuments({
        _id: { $in: members },
      });

      if (validMembers !== members.length) {
        return res.status(400).json({
          success: false,
          message: "One or more member IDs are invalid",
        });
      }
    }

    const project = await Project.create({
      title: title.trim(),
      description: description || "",
      createdBy: req.user.id,
      members: members || [],
      status: status || "PLANNING",
    });

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        project: populatedProject,
      },
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL PROJECTS
// ==========================================

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      count: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PROJECT
// ==========================================

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, members, status } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update fields only if provided
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Project title cannot be empty",
        });
      }

      project.title = title.trim();
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (members !== undefined) {
      if (!Array.isArray(members)) {
        return res.status(400).json({
          success: false,
          message: "Members must be an array",
        });
      }

      if (members.length > 0) {
        const validMembers = await User.countDocuments({
          _id: { $in: members },
        });

        if (validMembers !== members.length) {
          return res.status(400).json({
            success: false,
            message: "One or more member IDs are invalid",
          });
        }
      }

      project.members = members;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "PLANNING",
        "ACTIVE",
        "ON_HOLD",
        "COMPLETED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project status",
        });
      }

      project.status = status;
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        project: updatedProject,
      },
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PROJECT
// ==========================================

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};