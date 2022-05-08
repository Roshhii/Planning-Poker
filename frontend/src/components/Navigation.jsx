import React from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <h2 class="title-app">
            Planning Poker Application
          </h2>
          <div>
            <ul className="navbar-nav ml-auto">
            <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
