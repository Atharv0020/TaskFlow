import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>TaskFlow</h2>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span>
              👋 {user.name || user.email}
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;