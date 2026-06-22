import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("user_id");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo-link">
        <h1 className="logo">AI Travel Planner</h1>
      </Link>
      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/create-trip" className="nav-link">
          Create Trip
        </Link>
        <button type="button" onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
