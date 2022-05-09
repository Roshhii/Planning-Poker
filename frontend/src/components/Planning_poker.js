import React, { useEffect, useState } from "react";
import './Planning_poker.css';
import { useParams } from "react-router-dom"


var session_id
var name_session;


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

function NameForm() {

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
    <form onSubmit={handleSubmit}>

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

function Id() {
  const param = useParams();
  session_id = param.id;
  return param.id;
}


function Planning_poker({ socket }) {

  var [selectedCard, setSelectedCard] = useState(null);
  var [Backend_response, setBackendResponse] = useState(null);
  var [confirmed, serConfirmed] = useState(false);
  var [others_cards, setOtherCards] = useState(null);

  const [name, setName] = useState("");
  var [nameDisplay, setNameDisplay] = useState("");

  const [userStoryDisplay, setuserStoryDisplay] = useState();
  const [descriptionUserStory, setdescriptionUserStory]  = useState();



  var cards = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100]
  var isShow = false

  const callBackend = () => {
    socket.emit("card",
      JSON.stringify({
        "session_id": session_id,
        "name_session": name_session,
        "card": selectedCard
      }));
  }

  useEffect(() => {
    socket.on("receive_card", (data) => {
      setBackendResponse(data)
    });

    socket.on("receive_user", (data) => {
      console.log("INFO RECUUUU")
      var msg = JSON.parse(data)
      console.log("Username : " + msg.username)
      name_session = msg.username
      setNameDisplay(msg.username)
      console.log("NameDisplay : " + nameDisplay)
      session_id = msg.session_id
    });
  }, [socket])

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
    setSelectedCard(null)
    setBackendResponse(null)
    serConfirmed(false)
    isShow = false
    setOtherCards(null)
    document.getElementById("selected-card").style.backgroundColor = "#FCFCFD"
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
    if (name_session == null) { alert('Please enter your name to confirm'); }
    else if (selectedCard != null && !confirmed) {
      serConfirmed(true)
      document.getElementById("selected-card").style.backgroundColor = "#4CAF50"
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

  function handleShowClick() {
    if (isShow) {
      isShow = false
    }
    else {
      isShow = true
    }
    console.log(JSON.parse(Backend_response));

    console.log("Backend_response : " + Backend_response)
    //var users = JSON.parse(Backend_response)
    var users = JSON.parse(Backend_response)['Users'];

    var usersCards = [];
    for (var user in users) {
      console.log("Users user : " + users[user])
      if (users[user]['name'] != name_session) {
        usersCards.push(<strong>{users[user]['name']} : </strong>)
        usersCards.push(<SelectedCard
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
        onClick={() => handleShowClick()}
      />)
  }

  function UserStoryForm() {

    const [userStory, setuserStory] = useState();
    
    const handleSubmit = (evt) => {
      evt.preventDefault();
      //  name_session = name;
      setuserStoryDisplay(userStory)
    }
  
    const handleChange = (evt) => {
      evt.preventDefault();
      setuserStory(evt.target.value)
    }
  
    return (
      <form onSubmit={handleSubmit}>
  
        <input
          type="text"
          placeholder="Enter a User Story"
          value={userStory}
          onChange={handleChange}
        />
        <input type="submit" value="Create" />
      </form>
    );
  }
  
    function JiraImport() {
      const [file, setFile] = useState()
      const [XMl, setXML] = useState()
      var parser, xmlDoc;
  
      function handleChange(event) {
        setFile(event.target.files[0])
      }
  
      function handleSubmit(event) {
        event.preventDefault()
  
        const reader = new FileReader()
        reader.onload = function(evt) {
          setXML(evt.target.result);
        };
        reader.readAsText(file);
        
        //import Jira to USER STORY TEXT
      }

      function handleClick(){
        console.log(typeof XMl)
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(XMl,"text/xml");
        
        setuserStoryDisplay(xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("summary")[0].childNodes[0].nodeValue);
        var str = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("description")[0].childNodes[0].nodeValue
        setdescriptionUserStory(str.substring(3,str.length-4))

      }
  
      return (
        <div className="App">
          <form onSubmit={handleSubmit}>
            <h3>Jira Xml User story Upload</h3>
            <input type="file" onChange={handleChange} />
            <button type="submit">Upload</button>
            <button onClick={handleClick}> Import</button>
          </form>
        </div>
      );
    };





  return (
    <div class="main">
      <div><h2 className="id">Session Id : <Id /></h2></div>
      <h2>{name_session}</h2>
      <div><JiraImport /></div>
      <div><UserStoryForm /></div>
      <p>{userStoryDisplay}</p>
      {descriptionUserStory}
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
      <div className="board-row">
        <div>{renderShow()}</div>
      </div>
    </div>
  );
}

export default Planning_poker;
