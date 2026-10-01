import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        TaskFlow
      </div>

      <nav>
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/projects">
          Projects
        </NavLink>

        <NavLink to="/tasks">
          Tasks
        </NavLink>

        <NavLink to="/notifications">
          Notifications
        </NavLink>

        {user?.role === "ADMIN" && (
          <NavLink to="/admin">
            Admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;