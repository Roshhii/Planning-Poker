import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate  } from "react-router-dom";
import {
  Navigation,
  Home,
  Planning_poker,
  UserStory
} from "./components";
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001")


ReactDOM.render(
  <Router>
    <Navigation />
    <Routes>
      <Route exact path="/" element={<Home socket={socket}/>}/>
      {/* <Route path="/" element={<Home socket={socket} />} /> */}
      <Route path="/planning_poker/:id" element={<Planning_poker socket={socket} animate={true} />} />
      <Route path="/userStory/:id" element={<UserStory socket={socket} animate={true} />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);


serviceWorker.unregister();
