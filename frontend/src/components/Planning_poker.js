import React, { useState } from "react";
import './Planning_poker.css';
import {useParams} from "react-router-dom"


  function Card(props){
      return (
        <button 
          className="card"
          onClick={props.onClick}
        >
          {props.value}
        </button>
      );
    }

  function SelectedCard(props){
    return (
      <button
        className="card"
      >
        {props.value}
      </button>
    );
  }

  function Reset(props){
    return (
      <button
        className="reset"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

  function Confirm(props){
    return (
      <button
        className="reset"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

  function Show(props){
    return (
      <button
        className="reset"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

  var Id_session;
  var name_session;

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
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
        <p>Your Name : {nameDisplay}</p>
      </form>
    );
  }

  function Id(){
    const param = useParams();
    Id_session = param.id;
    return param.id;
  }

  
  class Planning_poker extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name: "",
            squares: [0,1,2,3,5,8,13,20,40,100],
            selectedCard: null,
            Backend_response: "",
            estimations: "",
            confirmed: false,
            isShow: false
        };
    }

    callBackend(){
      console.log(name_session);
      fetch("http://localhost:9000/session", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: ""+Id_session,
                                 name_session: ""+name_session,
                                 card: ""+this.state.selectedCard,
                                 })
      })
        .then(res => res.text())
        .then(res => this.setState({Backend_response: res}))
    }

    handleCardClick(i){
        if (!this.state.confirmed){
          this.setState({
              squares: this.state.squares,
              selectedCard: this.state.squares[i],
          });
        }
        
    }

    renderSquare(i) {
      return (
          <Card 
              value={this.state.squares[i]}
              onClick={() => this.handleCardClick(i)}
          />
      );
    }

    renderSelectedCard(){
      return (
        <SelectedCard 
            value={this.state.selectedCard}
        />
      );
    }

    handleResetClick(){
      this.setState({
        squares: this.state.squares,
        selectedCard: null,
        Backend_response: "",
        confirmed : false,
        estimations: "",
        isShow: false
      });
    }

    renderReset(){
      return (
        <Reset
            value={<div>Reset</div>}
            onClick={() => this.handleResetClick()}
        />
    );
    }

    handleConfirmClick(){
      if (name_session == null){alert('Please enter your name to confirm');}
      else if (this.state.selectedCard != null && !this.state.confirmed){
        this.setState({
          squares: this.state.squares,
          selectedCard: this.state.selectedCard,
          confirmed : true
        });
        this.callBackend()
      }
    }

    renderConfirm(){
      return (
        <Confirm
            value={<div>Confirm</div>}
            onClick={() => this.handleConfirmClick()}
        />
    );
    }

    handleShowClick(){
      if (this.state.isShow){
        this.setState({
          estimations: "",
          isShow: false
        });
      }
      else{
        this.setState({
          estimations: this.state.Backend_response,
          isShow: true
        });
      }
      console.log(JSON.parse(this.state.Backend_response));
     
    }

    renderShow(){
      return (
        <Show
            value={<div>Show</div>}
            onClick={() => this.handleShowClick()}
        />)
    }
  
    render() {

      let confirm_mes
      if (this.state.confirmed){
        confirm_mes = <p>Confirmed</p>
      }
      else {
        confirm_mes = <p>Not Confirmed</p>
      }

      
      return (
        <div class="main">
          <div><NameForm/></div>
          <div><h2>Id : <Id/></h2></div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            {this.renderSquare(9)}
          </div>
          <div className="board-row">
            {<h1>Selected Card :</h1>}
            {this.renderSelectedCard()}
            {this.renderReset()}
            <p>{this.state.estimations}</p>
          </div>  
            <div>{this.renderConfirm()}</div>
            <p>{confirm_mes}</p>
            <div>{this.renderShow()}</div>
        </div>
      );
    }
  }

  export default Planning_poker;
