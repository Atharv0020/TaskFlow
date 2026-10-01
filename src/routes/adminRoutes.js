const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

// ==========================================
// ADMIN DASHBOARD STATS
// GET /api/admin/stats
// ==========================================

router.get(
  "/stats",
  protect,
  requireAdmin,
  getAdminStats
);

// ==========================================
// GET ALL USERS
// GET /api/admin/users
// ==========================================

router.get(
  "/users",
  protect,
  requireAdmin,
  getAllUsers
);

// ==========================================
// UPDATE USER ROLE
// PUT /api/admin/users/:id/role
// ==========================================

router.put(
  "/users/:id/role",
  protect,
  requireAdmin,
  updateUserRole
);

// ==========================================
// DELETE USER
// DELETE /api/admin/users/:id
// ==========================================

router.delete(
  "/users/:id",
  protect,
  requireAdmin,
  deleteUser
);

module.exports = router;