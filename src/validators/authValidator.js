const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  const errors = [];

  if (!name || !name.trim()) {
    errors.push("Name is required");
  }

  if (!email || !emailRegex.test(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (
    role &&
    !["ADMIN", "MANAGER", "MEMBER"].includes(role)
  ) {
    errors.push("Invalid role");
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

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !emailRegex.test(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
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
  validateRegister,
  validateLogin,
};