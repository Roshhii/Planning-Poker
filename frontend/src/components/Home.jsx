import React, { useEffect, useState } from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

var name_session

function NameForm(props) {

  const [name, setName] = useState("");
  const [nameDisplay, setNameDisplay] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    name_session = name;
    setNameDisplay(name)
  }

  const handleChange = (evt) => {
    evt.preventDefault();
    setName(evt.target.value)
  }

  return (
    <form onSubmit={handleSubmit}
    className="name-form">
      <input
        type="text"
        placeholder="Enter a name"
        value={name}
        onChange={handleChange}
      />
      <input type="submit" value="Submit" />
      <p>Your Name : {nameDisplay}</p>
    </form>
  );
}

function Home({ socket }) {

  var [session_id, setSessionId] = useState("");

  const sendKey = () => {
    socket.emit("key", "I want a key!");
  }

  const sendInfoUser = () => {
    socket.emit("user", JSON.stringify({
      "username": name_session,
      "session_id": session_id
    }));
  }

  useEffect(() => {
    socket.on("receive_key", (data) => {
      console.log(data);
      setSessionId(data);
      document.getElementById("nav-link-Planning").style.display = "block"
      document.getElementById("session-key").style.display = "block"
      document.getElementById("send-button").style.display = "inline-block"
    })
  }, [socket])

  return (
    <div className="home">
      <div class="container">
        <h1>
          Welcome to the Planning poker Application
        </h1>
        <NameForm />
        <button onClick={sendKey} class="button">Generate Key</button>
        <p class="session-key" id="session-key">Your Session Key : {session_id}</p>
        <button onClick={sendInfoUser} id="send-button" class="send-button">Send Info User</button>
        <NavLink id="nav-link-Planning" className="nav-link-Planning" to={`/Planning_poker/${session_id}`}>
          -- Start the session --
        </NavLink>
      </div>
    </div>
  );
}

export default Home;
