import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
  
  class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            squares: [0,1,2,3,5,8,13,20,40,100],
            selectedCard: null,
            Backend_response: "",
            confirmed: false
        };
        
    }

    callBackend(){
      fetch("http://localhost:9000/", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card: ""+this.state.selectedCard })
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
        confirmed : false
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
      if (this.state.selectedCard != null){
        this.setState({
          squares: this.state.squares,
          selectedCard: this.state.selectedCard,
          Backend_response: this.state.Backend_response,
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
  
    render() {
      
      return (
        <div>
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
            <p>{this.state.Backend_response}</p>
          </div>  
            <div>{this.renderConfirm()}</div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  