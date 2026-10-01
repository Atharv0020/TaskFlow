const validateCreateProject = (req, res, next) => {
  const { title, description } = req.body;

  const errors = [];

  if (!title || !title.trim()) {
    errors.push("Project title is required");
  }

  if (title && title.trim().length > 150) {
    errors.push("Project title cannot exceed 150 characters");
  }

  if (
    description &&
    description.length > 2000
  ) {
    errors.push(
      "Project description cannot exceed 2000 characters"
    );
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

const validateUpdateProject = (req, res, next) => {
  const { title, description, status } = req.body;

  const errors = [];

  if (title !== undefined && !title.trim()) {
    errors.push("Project title cannot be empty");
  }

  if (
    title &&
    title.trim().length > 150
  ) {
    errors.push("Project title cannot exceed 150 characters");
  }

  if (
    description &&
    description.length > 2000
  ) {
    errors.push(
      "Project description cannot exceed 2000 characters"
    );
  }

  if (
    status &&
    !["ACTIVE", "COMPLETED", "ARCHIVED"].includes(status)
  ) {
    errors.push("Invalid project status");
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
  validateCreateProject,
  validateUpdateProject,
};