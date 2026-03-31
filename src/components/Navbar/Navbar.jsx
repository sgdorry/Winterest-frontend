import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
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
      <NavLink to="/profile" className="nav-item">
        Profile
      </NavLink>
    </nav>
  );
}

export default Navbar;
