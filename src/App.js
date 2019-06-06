import React, { Component } from 'react';
import './App.css';
import Header from './Header.js'
import Main from './Main.js'

class App extends Component {
  constructor() {
    super();
    
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Main />


      </div>
    );
  }
}

export default App;



