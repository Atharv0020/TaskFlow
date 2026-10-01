const mongoose = require("mongoose");

const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedUser,
      priority,
      status,
      dueDate,
    } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // Validate project
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Validate assigned user
    if (assignedUser) {
      if (!mongoose.Types.ObjectId.isValid(assignedUser)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID",
        });
      }

      const user = await User.findById(assignedUser);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }
    }

    // Create task
    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      projectId,
      assignedUser: assignedUser || null,
      priority: priority || "MEDIUM",
      status: status || "TODO",
      dueDate: dueDate || null,
    });

    // Populate response
    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "title status")
      .populate("assignedUser", "name email role");

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: populatedTask,
      },
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL TASKS
// GET /api/tasks
//
// Advanced Filtering:
// ?page=1
// ?limit=10
// ?search=JWT
// ?projectId=PROJECT_ID
// ?assignedUser=USER_ID
// ?status=IN_PROGRESS
// ?priority=URGENT
// ?sortBy=createdAt
// ?order=desc
// ==========================================

const getTasks = async (req, res) => {
  try {
    // ==========================================
    // PAGINATION
    // ==========================================

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit) || 10,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    // ==========================================
    // QUERY PARAMETERS
    // ==========================================

    const {
      projectId,
      assignedUser,
      status,
      priority,
      search,
    } = req.query;

    // ==========================================
    // FILTER OBJECT
    // ==========================================

    const filter = {};

    // ==========================================
    // PROJECT FILTER
    // ==========================================

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      filter.projectId = projectId;
    }

    // ==========================================
    // ASSIGNED USER FILTER
    // ==========================================

    if (assignedUser) {
      if (!mongoose.Types.ObjectId.isValid(assignedUser)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID",
        });
      }

      filter.assignedUser = assignedUser;
    }

    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (status) {
      const allowedStatuses = [
        "TODO",
        "IN_PROGRESS",
        "IN_REVIEW",
        "COMPLETED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
          allowedStatuses,
        });
      }

      filter.status = status;
    }

    // ==========================================
    // PRIORITY FILTER
    // ==========================================

    if (priority) {
      const allowedPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ];

      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task priority",
          allowedPriorities,
        });
      }

      filter.priority = priority;
    }

    // ==========================================
    // SEARCH
    // Search in title + description
    // ==========================================

    if (search && search.trim()) {
      const searchText = search.trim();

      filter.$or = [
        {
          title: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // SORTING
    // ==========================================

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "title",
      "priority",
      "status",
      "dueDate",
    ];

    const requestedSortBy =
      req.query.sortBy || "createdAt";

    const sortBy = allowedSortFields.includes(
      requestedSortBy
    )
      ? requestedSortBy
      : "createdAt";

    const sortOrder =
      req.query.order === "asc" ? 1 : -1;

    const sort = {
      [sortBy]: sortOrder,
    };

    // ==========================================
    // FETCH TASKS + COUNT
    // ==========================================

    const [tasks, totalTasks] =
      await Promise.all([
        Task.find(filter)
          .populate(
            "projectId",
            "title status"
          )
          .populate(
            "assignedUser",
            "name email role"
          )
          .sort(sort)
          .skip(skip)
          .limit(limit),

        Task.countDocuments(filter),
      ]);

    // ==========================================
    // PAGINATION CALCULATION
    // ==========================================

    const totalPages =
      Math.ceil(totalTasks / limit);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",

      data: {
        tasks,

        pagination: {
          currentPage: page,
          limit,
          totalTasks,
          totalPages,
          hasNextPage:
            page < totalPages,
          hasPreviousPage:
            page > 1,
        },

        filters: {
          projectId:
            projectId || null,

          assignedUser:
            assignedUser || null,

          status:
            status || null,

          priority:
            priority || null,

          search:
            search
              ? search.trim()
              : null,
        },

        sorting: {
          sortBy,
          order:
            sortOrder === 1
              ? "asc"
              : "desc",
        },
      },
    });
  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE TASK
// GET /api/tasks/:id
// ==========================================

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id)
      .populate("projectId", "title status")
      .populate(
        "assignedUser",
        "name email role"
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error(
      "Get task by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
// ==========================================

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      projectId,
      assignedUser,
      priority,
      status,
      dueDate,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ==========================================
    // UPDATE TITLE
    // ==========================================

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty",
        });
      }

      task.title = title.trim();
    }

    // ==========================================
    // UPDATE DESCRIPTION
    // ==========================================

    if (description !== undefined) {
      task.description = description;
    }

    // ==========================================
    // UPDATE PROJECT
    // ==========================================

    if (projectId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const project =
        await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      task.projectId = projectId;
    }

    // ==========================================
    // UPDATE ASSIGNED USER
    // ==========================================

    if (assignedUser !== undefined) {
      if (
        assignedUser === null ||
        assignedUser === ""
      ) {
        task.assignedUser = null;
      } else {
        if (
          !mongoose.Types.ObjectId.isValid(
            assignedUser
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid assigned user ID",
          });
        }

        const user =
          await User.findById(assignedUser);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Assigned user not found",
          });
        }

        task.assignedUser = assignedUser;
      }
    }

    // ==========================================
    // UPDATE PRIORITY
    // ==========================================

    if (priority !== undefined) {
      const allowedPriorities = [
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ];

      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority",
        });
      }

      task.priority = priority;
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    if (status !== undefined) {
      const allowedStatuses = [
        "TODO",
        "IN_PROGRESS",
        "IN_REVIEW",
        "COMPLETED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      task.status = status;
    }

    // ==========================================
    // UPDATE DUE DATE
    // ==========================================

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    await task.save();

    // ==========================================
    // POPULATED RESPONSE
    // ==========================================

    const updatedTask =
      await Task.findById(task._id)
        .populate(
          "projectId",
          "title status"
        )
        .populate(
          "assignedUser",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// ==========================================
// ASSIGN USER TO TASK
// PUT /api/tasks/:id/assign
// ==========================================

const assignUserToTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedUser } = req.body;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Validate user ID
    if (!assignedUser) {
      return res.status(400).json({
        success: false,
        message: "Assigned user ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        assignedUser
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid assigned user ID",
      });
    }

    // Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Find user
    const user =
      await User.findById(assignedUser);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Assign user
    task.assignedUser = assignedUser;

    await task.save();

    // Populate updated task
    const updatedTask =
      await Task.findById(task._id)
        .populate(
          "projectId",
          "title status"
        )
        .populate(
          "assignedUser",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message:
        "User assigned to task successfully",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    console.error(
      "Assign user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to assign user to task",
      error: error.message,
    });
  }
};

// ==========================================
// UNASSIGN USER FROM TASK
// PUT /api/tasks/:id/unassign
// ==========================================

const unassignUserFromTask = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Remove assigned user
    task.assignedUser = null;

    await task.save();

    // Populate updated task
    const updatedTask =
      await Task.findById(task._id)
        .populate(
          "projectId",
          "title status"
        )
        .populate(
          "assignedUser",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message:
        "User unassigned from task successfully",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    console.error(
      "Unassign user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to unassign user from task",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  assignUserToTask,
  unassignUserFromTask,
  deleteTask,
};