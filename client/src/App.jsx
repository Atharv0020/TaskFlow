import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/tasks/:id"
              element={<TaskDetails />}
            />

            <Route
              path="/notifications"
              element={
                <Notifications />
              }
            />

            <Route
              path="/admin"
              element={<Admin />}
            />
          </Route>

          {/* Default */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;