import { useEffect, useState } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response =
          await api.get("/dashboard");

        setData(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="page">
        <h1>Dashboard</h1>

        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const summary = data.summary || {};

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>
            Welcome back{user?.name
              ? `, ${user.name}`
              : ""}! 👋
          </h1>

          <p style={{ color: "#64748b" }}>
            Here's what's happening with
            your projects today.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">

        <div className="stat-card">
          <h3>📋 Total Tasks</h3>

          <strong>
            {summary.totalTasks || 0}
          </strong>
        </div>

        <div className="stat-card">
          <h3>✅ Completed</h3>

          <strong>
            {summary.completedTasks || 0}
          </strong>
        </div>

        <div className="stat-card">
          <h3>⏳ In Progress</h3>

          <strong>
            {summary.inProgressTasks || 0}
          </strong>
        </div>

        <div className="stat-card">
          <h3>📁 Projects</h3>

          <strong>
            {summary.totalProjects || 0}
          </strong>
        </div>

      </div>

      <div className="card">
        <h2>TaskFlow Overview</h2>

        <p>
          Manage your projects, tasks,
          comments and team activity from
          one place.
        </p>
      </div>

    </div>
  );
};

export default Dashboard;