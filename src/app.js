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

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  "https://task-flow-omega-orpin.vercel.app",
  "https://task-flow-k8e9h51t5-atharv-s-projects13.vercel.app",
  "https://task-flow-git-main-atharv-s-projects13.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
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