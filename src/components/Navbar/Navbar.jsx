import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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
    </nav>
  );
}

export default Navbar;
