// ==========================================
// ADMIN ROLE MIDDLEWARE
// ==========================================

const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GENERIC ROLE MIDDLEWARE
// ==========================================

const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requireAdmin;
module.exports.requireAdmin = requireAdmin;
module.exports.requireRole = requireRole;