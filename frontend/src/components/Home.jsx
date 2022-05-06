import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Home() {

  var [id_modif, setInputValue] = useState("");

  async function handleClickKey(){
    await fetch("http://localhost:9000/", {
      })
      .then(res => res.text())
      .then(function(data) {
        setInputValue(data);
      });
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
            <h1 class="font-weight-light">Home page</h1>
            <p>
              Welcome to the Planning poker Application
            </p>
            <button onClick={() => handleClickKey()}>Generate Key</button>
            <p>Your Session Key : {id_modif}</p>
            <li className="nav-item">
                <NavLink className="nav-link" to={`/Planning_poker/${id_modif}`}>
                Planning poker
                </NavLink>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
