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
  
  class Board extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            squares: [0,1,2,3,5,8,13,20,40,100],
            selectedCard: null,
        };
        
    }

    handleClick(i){

        this.setState({
            squares: this.state.squares,
            selectedCard: this.state.squares[i],
        });
    }

    renderSquare(i) {
      return (
          <Card 
              value={this.state.squares[i]}
              onClick={() => this.handleClick(i)}
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
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Board />,
    document.getElementById('root')
  );
  