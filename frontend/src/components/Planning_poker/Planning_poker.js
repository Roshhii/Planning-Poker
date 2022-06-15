import React, { useEffect, useState } from "react";
import './Planning_poker.css';
import { useParams, NavLink, useLocation } from "react-router-dom"

//var name_session;


function Card(props) {
  return (
    <button
      className="card"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function SelectedCard(props) {
  return (
    <button
      id="selected-card"
      className="card"
    >
      {props.value}
    </button>
  );
}

function Reset(props) {
  return (
    <button
      className="reset"
      onClick={props.onClick}
    >
      Reset
    </button>
  );
}

function Confirm(props) {
  return (
    <button
      className="confirm"
      onClick={props.onClick}
    >
      Confirm
    </button>
  );
}

function Show(props) {
  return (
    <button
      className="show"
      onClick={props.onClick}
    >
      Show
    </button>
  );
}

function Export(props) {
  return (
    <button
      className="export"
      onClick={props.onClick}
    >
      Export
    </button>
  );
}

function UserStory(props) {
  return (
    <button
      id={props.id}
      className="userStory"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}


function Planning_poker({ socket }) {

  const location = useLocation()

  var session_id = useParams().id;
  var cards = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];
  var isShow = false


  //var { username } = localStorage.getItem("username")
  var { username } = location.state

  var [nb_userStory, setNBUserStory] = useState(0);
  var [userStory, setUserStory] = useState(userStory);
  var [tasks, setTasks] = useState(tasks);
  var [selectedUserStory, setSelectedUserStory] = useState(null);

  var userStory_storage = null

  var list_userStoryDisplay = []
  if (session_id == window.localStorage.getItem('session_id')) {
    nb_userStory = window.localStorage.getItem('nb_userStory')
    userStory_storage = window.localStorage.getItem('userStories')

    for (var i = 0; i < nb_userStory; i++) {
      let value = i + 1
      list_userStoryDisplay.push(<UserStory
        id={"userCard" + value}
        value={value}
        onClick={() => handleUserStoryClick(value)}
      />);
    }
    list_userStoryDisplay = <div class="grid-child">{list_userStoryDisplay} </div>
  }

  else {
    list_userStoryDisplay = null;
  }





  var [userStories, setUserStorys] = useState(userStory_storage);
  var [userStorysDisplay, setUserStorysDisplay] = useState(list_userStoryDisplay);
  var [selectedCard, setSelectedCard] = useState(null);
  var [Backend_response, setBackendResponse] = useState(null);
  var [confirmed, serConfirmed] = useState(false);
  var [others_cards, setOtherCards] = useState(null);

  var [nameDisplay, setNameDisplay] = useState("");
  const callBackend = () => {
    socket.emit("card",
      JSON.stringify({
        "session_id": session_id,
        "name_session": username,
        "card": selectedCard,
        "email": JSON.parse(localStorage.getItem("user")).email,
        "username": username
      }));
  }

  const callShow = () => {
    socket.emit("show",
      JSON.stringify({
        "session_id": session_id,
        "email": JSON.parse(localStorage.getItem("user")).email,
        "username": username
      }));
  }

  useEffect(() => {

    setNBUserStory(window.localStorage.getItem('nb_userStory'));


    socket.on("receive_card", (data) => {
      console.log("Receive Card !" + data)
      setBackendResponse(data)
    });

    socket.on("receive_user", (data) => {
      var msg = JSON.parse(data)
      console.log("Username : " + msg.username)
      setNameDisplay(msg.username)
      console.log("NameDisplay : " + nameDisplay)
      session_id = msg.session_id
    });

    socket.on("receive_show", (data) => {
      console.log("Receive Show " + data);

      handleShow(data);
      setBackendResponse(data)
    });

    socket.on("receive_AddUserStory", (data) => {
      console.log("Receive Add UserStory " + data);
      window.localStorage.setItem('userStories', data)
      setUserStorys(data)
      var data = JSON.parse(data)['UserStories']

      var list_userStoryDisplay = [];

      for (var i in data) {
        let value = parseInt(i) + 1;
        list_userStoryDisplay.push(<UserStory
          id={"userCard" + value}
          value={value}
          onClick={() => handleUserStoryClick(value)}
        />);
      }
      setUserStorysDisplay(<div class="grid-child">{list_userStoryDisplay} </div>)

      
      nb_userStory = list_userStoryDisplay.length;

      console.log("Before storage : " + session_id)
      window.localStorage.setItem("session_id", session_id)
      window.localStorage.setItem('nb_userStory', list_userStoryDisplay.length)
      
    });

    socket.on("receive_getUserStory", (data) => {
      console.log("Receive User Story " + data);
      var msg = JSON.parse(data)
      setUserStory(msg.userStory);
      setTasks(msg.tasks);
    });

    socket.on("receive_reset", (data) => {
      console.log("Receive Reset " + data);
      setOtherCards(null);
    });
  }, [socket])

  function handleUserStoryClick(i) {
    console.log("CLICK ON : " + i)
    setSelectedUserStory(i)
    document.getElementById("removeUserStory").style.display = "inline-block"
    document.getElementById("nav-link-UpdateUserStory").style.display = "inline-block"

    for (var k = 1; k <= nb_userStory; k++) {
      console.log("NB User Stories : " + nb_userStory + "   k : " + k)
      if (k == i) {
        document.getElementById("userCard" + k).style.backgroundColor = "#aaaaaa";
      }
      else {
        document.getElementById("userCard" + k).style.backgroundColor = "white";
      }
    }
    socket.emit("getUserStory",
      JSON.stringify({
        "session_id": session_id,
        "name_session": username, /////////////////
        "selectedUserStory": i
      }));
  }

  function handleCardClick(i) {
    if (!confirmed) {
      setSelectedCard(cards[i]);
    }
  }

  function renderSquare(i) {
    return (
      <Card
        value={cards[i]}
        onClick={() => handleCardClick(i)}
      />
    );
  }

  function renderSelectedCard() {
    return (
      <SelectedCard
        value={selectedCard}
      />
    );
  }

  function handleResetClick() {
    socket.emit("reset",
      JSON.stringify({
        "session_id": session_id,
        "name_session": username, ///////////////
        "card": selectedCard
      }));
    setSelectedCard(null)
    setBackendResponse(null)
    serConfirmed(false)
    isShow = false
    setOtherCards(null)
    document.getElementById("selected-card").style.backgroundColor = "#FCFCFD"
    document.getElementById("selected-card").style.border = "unset"

  }

  function renderReset() {
    return (
      <Reset
        value={<div>Reset</div>}
        onClick={() => handleResetClick()}
      />
    );
  }

  function handleConfirmClick() {
    if (selectedCard != null && !confirmed) {
      serConfirmed(true)
      document.getElementById("selected-card").style.border = "3px solid #45B636"
      callBackend()
    }
  }

  function renderConfirm() {
    return (
      <Confirm
        value={<div>Confirm</div>}
        onClick={() => handleConfirmClick()}
      />
    );
  }

  async function handleShow(data) {
    
    if (isShow) {
      isShow = false
    }
    else {
      isShow = true
    }

    var users = JSON.parse(data)['Users'];

    var usersCards = [];
    for (var user in users) {
      console.log("Users user : " + users[user])
      if (users[user]['name'] != username) { /////////////////////
        usersCards.push(<strong>{users[user]['name']} : </strong>)
        usersCards.push(<Card
          value={users[user]['card']}
        />);
      }
    }
    setOtherCards(<div class="grid-child">{usersCards} </div>)

   

  }

  function renderShow() {
    return (
      <Show
        value={<div>Show</div>}
        onClick={() => callShow()}
      />)
  }

  function handleExportClick() {

    console.log("Users Stories JIRA EXPORT : " + userStories)

    var estimations = "";

    var users = JSON.parse(Backend_response)['Users'];
    console.log(Backend_response)
    for (var user in users) {
      estimations += users[user]['name'] + " : "
      estimations += users[user]['card'] + "    ";
    }

    const rows = [["IssueType", "Summary", "Description"]];

    for (var us of JSON.parse(userStories)['UserStories']){
      rows.push(["Story", us["userStory"], us["tasks"] + "    " + estimations])
    }

    let csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.join(",")).join("\n");

    //download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `results_session-${session_id}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "result.csv".
  }

  function renderExport() {
    return (
      <Export
        value={<div>Export</div>}
        onClick={() => handleExportClick()}
      />)
  }

  function removeUserStory() {
    console.log("Remove : " + selectedUserStory)
    socket.emit("removeUserStory",
      JSON.stringify({
        "session_id": session_id,
        "name_session": username, ///////////////////
        "selectedUserStory": selectedUserStory
      }));
    document.getElementById("removeUserStory").style.display = "none"
    document.getElementById("nav-link-UpdateUserStory").style.display = "none"

    for (var k = 1; k <= nb_userStory; k++) {
      document.getElementById("userCard" + k).style.backgroundColor = "white";
    }
    setUserStory(null);
    setTasks(null);
  }



  return (
    <div class="main">
      <h3 className="id">Session Id : {session_id}</h3>
      <h2>Hello {username} !</h2>
      <div><NavLink id="nav-link-AddUserStory" className="nav-link-AddUserStory" to={`/UserStory/${session_id}`} state={{ username: username, msg: "add", selectedUserStory: nb_userStory + 1, title: "", description : "" }}>
        Add User Story
      </NavLink></div>
      <div>{userStorysDisplay}</div>
      <div><button onClick={removeUserStory} class="removeUserStory" id="removeUserStory">Remove User Story</button>
      <NavLink id="nav-link-UpdateUserStory" className="removeUserStory" to={`/UserStory/${session_id}`} state={{ username: username, msg: "update", selectedUserStory: selectedUserStory, title: userStory, description : tasks }}>
        Update User Story
      </NavLink></div>
      <h2 style={{marginTop: 12}}><strong>User Story :</strong> {userStory}</h2>
      <h2 style={{marginTop: 12}}><strong>Tasks :</strong> {tasks}</h2>

      <div id="line-cards-buttons">
        <div class="child">{renderSquare(0)}</div>
        <div class="child">{renderSquare(1)}</div>
        <div class="child">{renderSquare(2)}</div>
        <div class="child">{renderSquare(3)}</div>
        <div class="child">{renderSquare(4)}</div>
        <div class="child">{renderSquare(5)}</div>
        <div class="child">{renderSquare(6)}</div>
        <div class="child">{renderSquare(7)}</div>
        <div class="child">{renderSquare(8)}</div>
        <div class="child">{renderSquare(9)}</div>
        <div class="child"> {renderConfirm()} </div>
        <div class="child"> {renderReset()} </div>
      </div>
      <div class="grid-selected">
        <div class="grid-child"><h3>Selected Card:</h3></div>
        <div class="grid-child"><h3>The other:</h3></div>
        <div class="grid-child">{renderSelectedCard()}</div>
        {others_cards}
      </div>
      <div className="show-export-row">
        <div>{renderShow()}</div>
        <div>{renderExport()}</div>
      </div>
    </div>
  );
}

export default Planning_poker;
