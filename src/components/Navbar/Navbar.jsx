import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-item">
        Home 
      </NavLink>
      <NavLink to="/countries" className="nav-item">
        Countries
      </NavLink>

      <NavLink to="/states" className="nav-item">
        States
      </NavLink>

      <NavLink to="/cities" className="nav-item">
        Cities
      </NavLink>

      <NavLink to="/counties" className="nav-item">
        Counties
      </NavLink>
    </nav>
  );
}

export default Navbar;