import { useEffect, useState } from "react";
import api from "../services/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    tasks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * These endpoints should match your backend
       * adminRoutes.js.
       *
       * If your backend uses different endpoints,
       * only change these URLs.
       */

      const [usersResponse, statsResponse] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/stats"),
        ]);

      const userData =
        usersResponse.data?.data;

      const statsData =
        statsResponse.data?.data;

      setUsers(
        userData?.users ||
          userData ||
          []
      );

      setStats({
        users:
          statsData?.users ||
          statsData?.totalUsers ||
          0,

        projects:
          statsData?.projects ||
          statsData?.totalProjects ||
          0,

        tasks:
          statsData?.tasks ||
          statsData?.totalTasks ||
          0,
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load admin data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.put(
        `/admin/users/${userId}/role`,
        { role }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, role }
            : user
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update role"
      );
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/admin/users/${userId}`
      );

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== userId
        )
      );

      setStats((prev) => ({
        ...prev,
        users: Math.max(
          0,
          prev.users - 1
        ),
      }));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>

        <p>
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>
            Admin Dashboard 🛠️
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "5px",
            }}
          >
            Manage users and monitor
            TaskFlow activity.
          </p>
        </div>

        <button
          onClick={loadAdminData}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* STAT CARDS */}

      <div className="dashboard-grid">

        <div className="stat-card">
          <h3>
            👥 Total Users
          </h3>

          <strong>
            {stats.users}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            📁 Total Projects
          </h3>

          <strong>
            {stats.projects}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            📋 Total Tasks
          </h3>

          <strong>
            {stats.tasks}
          </strong>
        </div>

        <div className="stat-card">
          <h3>
            ⚡ System
          </h3>

          <strong
            style={{
              color: "#10b981",
              fontSize: "20px",
            }}
          >
            Healthy
          </strong>
        </div>

      </div>

      {/* USERS */}

      <div className="card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <div>
            <h2>
              User Management
            </h2>

            <p>
              Manage TaskFlow users and
              their roles.
            </p>
          </div>

          <span
            style={{
              background: "#eef2ff",
              color: "#4f46e5",
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {users.length} Users
          </span>
        </div>

        {users.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#64748b",
            }}
          >
            No users found.
          </div>
        ) : (
          <div>

            {users.map((user) => (

              <div
                className="user-row"
                key={user._id}
              >

                {/* USER */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    {(
                      user.name ||
                      user.email ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {user.name ||
                        "Unnamed User"}
                    </strong>

                    <p>
                      {user.email}
                    </p>
                  </div>

                </div>

                {/* ROLE */}

                <select
                  value={
                    user.role || "MEMBER"
                  }
                  onChange={(e) =>
                    updateRole(
                      user._id,
                      e.target.value
                    )
                  }
                >
                  <option value="ADMIN">
                    ADMIN
                  </option>

                  <option value="MANAGER">
                    MANAGER
                  </option>

                  <option value="MEMBER">
                    MEMBER
                  </option>
                </select>

                {/* DELETE */}

                <button
                  onClick={() =>
                    deleteUser(
                      user._id
                    )
                  }
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                  }}
                >
                  Delete
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Admin;