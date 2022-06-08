import React from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

function Navigation() {

  const user = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    window.location = "/";
  };

  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <ul className="nav-links">
            <li><NavLink className="nav-link" to="/">Home</NavLink></li>
            {/* <li><NavLink className="nav-link" onClick={handleLogout} to="/login">Logout</NavLink></li> */}
            {/* <li><NavLink className="nav-link" to="/history">History</NavLink></li> */}
            {user && <li><NavLink className="nav-link" to="/history">History</NavLink></li>}
            {user && <li><NavLink className="nav-link" id="logout" onClick={handleLogout} to="/login">Logout</NavLink></li>}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
