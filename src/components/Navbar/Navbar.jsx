import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>
        <NavLink to="/play" className="nav-item">
          Play
        </NavLink>
        <NavLink to="/leaderboard" className="nav-item">
          Leaderboard
        </NavLink>
        <NavLink to="/how-to-play" className="nav-item">
          How to Play
        </NavLink>
      </div>

      <div className="navbar-account">
        {user ? (
          <div className="account-menu">
            <button
              type="button"
              className="nav-item account-trigger"
              aria-haspopup="true"
            >
              Profile
            </button>
            <div className="account-dropdown" role="menu">
              <Link to="/profile" className="account-dropdown-item" role="menuitem">
                View Profile
              </Link>
              <button
                type="button"
                className="account-dropdown-item"
                role="menuitem"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-item">
              Log In
            </Link>
            <Link to="/signup" className="nav-item nav-item-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
