import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={backendResponse:""};
  }

  callBackend(){
    fetch("http://localhost:9000/users")
      .then(res => res.text())
      .then(res => this.setState({backendResponse:res}))
  }

  componentWillMount(){
    this.callBackend();
  }
render(){
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

      </header>
      <p>{this.state.backendResponse}</p>
    </div>
  );
}
}

export default App;
