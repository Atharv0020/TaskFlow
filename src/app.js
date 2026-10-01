const express = require("express");
const cors = require("cors");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// ==========================================
// MIDDLEWARE
// ==========================================

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is healthy",
  });
});

// ==========================================
// AUTH
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// PROJECTS
// ==========================================

app.use("/api/projects", projectRoutes);

// ==========================================
// TASKS
// ==========================================

app.use("/api/tasks", taskRoutes);

// ==========================================
// COMMENTS
// ==========================================

app.use("/api", commentRoutes);

// ==========================================
// ACTIVITIES
// ==========================================

app.use("/api", activityRoutes);

// ==========================================
// ADMIN
// IMPORTANT
// /api/admin/stats
// ==========================================

app.use("/api/admin", adminRoutes);

// ==========================================
// DASHBOARD
// ==========================================

app.use("/api/dashboard", dashboardRoutes);

// ==========================================
// NOTIFICATIONS
// ==========================================

app.use("/api/notifications", notificationRoutes);

// ==========================================
// 404
// ==========================================

app.use(notFoundMiddleware);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(errorMiddleware);

// ==========================================
// EXPORT
// ==========================================

module.exports = app;