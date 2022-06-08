import React, { useEffect, useState } from "react";
import './Home.css';
import { NavLink, useNavigate } from "react-router-dom";

var name_session

function Home({ socket }) {

  var [session_id, setSessionId] = useState();

  const localItemUser = JSON.parse(localStorage.getItem("user"))
  name_session = localItemUser.firstName + "-" + localItemUser.lastName

  function IdSessionForm() {

    const [id, setId] = useState();

    const handleSubmit = (evt) => {
      evt.preventDefault();
      socket.emit("user", JSON.stringify({
        "username": name_session,
        "session_id": id
      }));
      setSessionId(id)

      document.getElementById("nav-link-Planning").style.display = "block"
      document.getElementById("session-key").style.display = "block"
      document.getElementById("send-button").style.display = "inline-block"
    }

    const handleChange = (evt) => {
      evt.preventDefault();
      setId(evt.target.value)
    }

    return (
      <form onSubmit={handleSubmit}
        className="name-form">
        <input
          type="text"
          placeholder="Enter a Session Key"
          value={id}
          onChange={handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }

  const requestKey = () => {
    socket.emit("key", "I want a key!");
  }

  useEffect(() => {
    socket.on("receive_key", (data) => {
      console.log("Key received: ", data);
      setSessionId(data);
      socket.emit("user", JSON.stringify({
        "username": name_session,
        "session_id": data
      }));
      document.getElementById("nav-link-Planning").style.display = "block"
      document.getElementById("session-key").style.display = "block"
    })
  }, [socket])

  return (
    <div className="home">
      <div class="container">
        <h1>
          Welcome to the Planning poker Application
        </h1>
        <p>Your name: {name_session}</p>
        <IdSessionForm />
        <p>OR</p>
        <button onClick={requestKey} class="button">Generate Key</button>
        <p class="session-key" id="session-key">Your Session Key : {session_id}</p>
        <NavLink id="nav-link-Planning" className="nav-link-Planning" to={`/planning_poker/${session_id}`} state={{ username: name_session }} >
          -- Start the session --
        </NavLink>
      </div>
    </div>
  );
}

export default Home;
