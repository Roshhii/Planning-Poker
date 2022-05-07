import React, { useState } from "react";
import './Planning_poker.css';
import { useParams } from "react-router-dom"

var Id_session;
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

function UserStoryForm(props) {

  const [userStory, setuserStory] = useState("");
  const [userStoryDisplay, setuserStoryDisplay] = useState("");

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
      <p>The User Story : {userStoryDisplay}</p>
    </form>
  );
}



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
  Id_session = param.id;
  return param.id;
}


class Planning_poker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "",
      squares: [0, 1, 2, 3, 5, 8, 13, 20, 40, 100],
      selectedCard: null,
      Backend_response: "",
      estimations: "",
      confirmed: false,
      isShow: false,
      others_cards: null
    };
  }

  callBackend() {
    console.log(name_session);
    fetch("http://localhost:9000/"+name_session, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: "" + Id_session,
        name_session: "" + name_session,
        card: "" + this.state.selectedCard,
      })
    })
      .then(res => res.text())
      .then(res => this.setState({ Backend_response: res }))
  }

  handleCardClick(i) {
    if (!this.state.confirmed) {
      this.setState({
        squares: this.state.squares,
        selectedCard: this.state.squares[i],
      });
    }

  }

  renderCard(i) {
    return (
      <Card
        value={this.state.squares[i]}
        onClick={() => this.handleCardClick(i)}
      />
    );
  }

  renderSelectedCard() {
    return (
      <SelectedCard
        value={this.state.selectedCard}
      />
    );
  }

  handleResetClick() {
    this.setState({
      squares: this.state.squares,
      selectedCard: null,
      Backend_response: "",
      confirmed: false,
      estimations: "",
      isShow: false,
      others_cards: null
    });
    document.getElementById("selected-card").style.backgroundColor = "#FCFCFD";
  }

  renderReset() {
    return (
      <Reset
        value={<div>Reset</div>}
        onClick={() => this.handleResetClick()}
      />
    );
  }

  handleConfirmClick() {
    if (name_session == null) { alert('Please enter your name to confirm'); }
    else if (this.state.selectedCard != null && !this.state.confirmed) {
      this.setState({
        squares: this.state.squares,
        selectedCard: this.state.selectedCard,
        confirmed: true
      });
      document.getElementById("selected-card").style.backgroundColor = "#4CAF50"
      this.callBackend()
    }
  }

  renderConfirm() {
    return (
      <Confirm
        value={<div>Confirm</div>}
        onClick={() => this.handleConfirmClick()}
      />
    );
  }

  handleShowClick() {
    if (this.state.isShow) {
      this.setState({
        estimations: "",
        isShow: false
      });
    }
    else {
      this.setState({
        estimations: this.state.Backend_response,
        isShow: true
      });
    }

    var users = JSON.parse(this.state.Backend_response)['Users'];

    var usersCards = [];
    for (var user in users) {
        if (users[user]['name'] != name_session){
          usersCards.push(<strong>{users[user]['name']} : </strong>)
          usersCards.push(<SelectedCard
            value={users[user]['card']}
          />);
        }
    }
    this.setState({others_cards: <div class="grid-child">{usersCards} </div>})

  }

  renderShow() {
    return (
      <Show
        value={<div>Show</div>}
        onClick={() => this.handleShowClick()}
      />)
  }

  render() {

    return (
      <div class="main">
        <div><NameForm /></div>
        <div><h2>Id : <Id /></h2></div>
        <div><UserStoryForm/></div>
        <div id="line-cards-buttons">
          <div class="child">{this.renderCard(0)}</div>
          <div class="child">{this.renderCard(1)}</div>
          <div class="child">{this.renderCard(2)}</div>
          <div class="child">{this.renderCard(3)}</div>
          <div class="child">{this.renderCard(4)}</div>
          <div class="child">{this.renderCard(5)}</div>
          <div class="child">{this.renderCard(6)}</div>
          <div class="child">{this.renderCard(7)}</div>
          <div class="child">{this.renderCard(8)}</div>
          <div class="child">{this.renderCard(9)}</div>
          <div class="child"> {this.renderConfirm()} </div>
          <div class="child"> {this.renderReset()} </div>
        </div>
        <div class="grid-selected">
          <div class="grid-child"><h3>Selected Card:</h3></div>
          <div class="grid-child"><h3>The Others:</h3></div>
          <div class="grid-child">{this.renderSelectedCard()}</div>
          {this.state.others_cards}
        </div>
        <div className="board-row">
          <div>{this.renderShow()}</div>
        </div>
      </div>
    );
  }
}

export default Planning_poker;
