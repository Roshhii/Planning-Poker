import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Home,
  Planning_poker
} from "./components";


ReactDOM.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/planning_poker/:id" element={<Planning_poker animate={true} />} />

    </Routes>
  </Router>,

  document.getElementById("root")
);


serviceWorker.unregister();
