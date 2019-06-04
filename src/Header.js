import React, { Component } from 'react';
import axios from 'axios';

class Header extends Component {
    constructor() {
        super();

        this.state = {
            userInput: "",
            userSearch: "",
            showsArray: []
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
            // const showData = results.data

            const filteredData = results.data.filter(item => 
                item.show.image != null)

            console.log(filteredData)

            this.setState({
                showsArray: filteredData
            })

            // console.log(results.data)
            // console.log(this.state.showsArray)
        }).catch(error => {
            console.log('error')
        })
    }



    render() {
        return (
            <header className="wrapper">
                <form action="">
                    <label htmlFor="searchBar"></label>
                    <input type="text" id="searchBar" onChange={this.handleChange}></input>
                    <input type="submit" onClick={this.handleSearch} />
                </form>
                <div className="showLists">
                    <div className="showResults">

                        { this.state.showsArray.map((item) => {
                            return <img src={item.show.image.original}/>
                        }) }

                    </div>
                    <div className="listCreator">

                    </div>
                </div>
            </header>
        );
    }
}

export default Header;