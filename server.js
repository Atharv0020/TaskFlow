// ======================================
// Environment Configuration
// ======================================

require("dotenv").config();

// ======================================
// Imports
// ======================================

const app = require("./src/app");
const connectDB = require("./src/config/db");

// ======================================
// Configuration
// ======================================

const PORT = process.env.PORT || 5000;

// ======================================
// Start Server
// ======================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 TaskFlow server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// ======================================
// Initialize Application
// ======================================

startServer();