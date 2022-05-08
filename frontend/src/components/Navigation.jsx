import React from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <ul>
            <li><NavLink className="nav-link" to="/">Home</NavLink></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
