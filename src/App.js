import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      userInput: "",
      userSearch: ""
    }
  }

  handleChange = event => {
    this.setState({
      userInput: event.target.value
    })
  }

  handleSearch = event => {
    event.preventDefault();
    const userQuery = this.state.userInput;
    this.setState({
      userSearch: userQuery 
    }, () => {
      this.searchShows(this.state.userSearch)
    })
  }

  searchShows = (userSearch) => {
    axios({
      method: 'GET',
      url: "http://api.tvmaze.com/search/shows",
      dataResponse: 'json',
      params: {
        q: userSearch
      }
    }).then(results => {
      console.log(results)
    }).catch(error => {
      console.log('error')
    })
  }

  render() {
    return (
      <div className="App">
        <form action="">
          <label htmlFor="searchBar"></label>
          <input type="text" id="searchBar" onChange={this.handleChange}></input>
          <input type="submit" onClick={this.handleSearch} />
        </form>
      </div>
    );
  }
}

export default App;



