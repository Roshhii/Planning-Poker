import React, { useState } from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

function Home() {

  var [id_modif, setInputValue] = useState("");

  async function handleClick(){
    await fetch("http://localhost:9000/", {
      })
      .then(res => res.text())
      .then(function(data) {
        setInputValue(data);
      });
    document.getElementById("nav-link-Planning").style.display = "block"
    document.getElementById("session-key").style.display = "block"
  }
  
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
            <button onClick={() => handleClick()} class="button">Generate Key</button>
            <p class="session-key" id="session-key">Your Session Key : {id_modif}</p>
            <NavLink id="nav-link-Planning" className="nav-link-Planning" to={`/Planning_poker/${id_modif}`}>
                 Planning poker
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
