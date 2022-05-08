import React, { useEffect, useState } from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

function Home({ socket }) {

  var [session_id, setSessionId] = useState("");

  const sendKey = () => {
    socket.emit("key", "I want a key!");
  }

  useEffect(() => {
    socket.on("receive_key", (data) => {
      console.log(data);
      setSessionId(data);
      document.getElementById("nav-link-Planning").style.display = "block"
      document.getElementById("session-key").style.display = "block"
    })
  }, [socket])
  
  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src="http://placehold.it/900x400"
              alt=""
            />
          </div>
          <div class="col-lg-5">
            <h1>
              Welcome to the Planning poker Application
            </h1>
            <button onClick={sendKey} class="button">Generate Key</button>
            <p class="session-key" id="session-key">Your Session Key : {session_id}</p>
            <NavLink id="nav-link-Planning" className="nav-link-Planning" to={`/Planning_poker/${session_id}`}>
                 Planning poker
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
