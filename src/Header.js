import React, { Component } from 'react';
import axios from 'axios';

class Header extends Component {
    constructor() {
        super();

        this.state = {
            // binding out input
            userInput: "",
            // storing our user's search input
            userSearch: "",
            // data gathered from API and shoved into this box
            showsArray: [],
            // this is where we're going to put all our gathered info of the show
            showsInfo: {},
            // is the modal initially shown? no.
            isModalShown: false,
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
            const filteredData = results.data.filter(item => 
                item.show.image != null)

            console.log(filteredData)

            this.setState({
                showsArray: filteredData
            })

        }).catch(error => {
            console.log('error')
        })
    }

    // each click upon each show is re-updating the state.
    showDetails = (e) => {
        // onClick... go grab the value of these data?
        // console.log(e.target.getAttribute("data-title"));
        // console.log(e.target.getAttribute("data-id"));
        // console.log(e.target.getAttribute("data-summary"));
        
        const title = e.target.getAttribute("data-title");
        const id = e.target.getAttribute("data-id");
        const summary = e.target.getAttribute("data-summary");

        this.setState ({
            showsInfo: {
                title,
                id,
                summary
            }
        }, () => {
            console.log(this.state.showsInfo);
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
                        {/* map through the showsArray and for each item... we want to grab the data/ attributes...below? */}
                        { this.state.showsArray.map((item, key) => {
                            return <div key={item.show.id} className="showPoster">
                            <img 
                                src={item.show.image.original} 
                                alt="" 
                                data-id={item.show.id}
                                data-summary={item.show.summary}
                                data-title={item.show.name}
                                onClick={this.showDetails}/>
                            </div>
                        }) }

                    </div>
                    {/* this is where we are going to append the modal on click? */}
                    <div className="showModal">
                        <h2>{this.state.showsInfo.title}</h2>
                        <p>{this.state.showsInfo.summary}</p>
                    </div>
                    <div className="listCreator">

                    </div>
                </div>
            </header>
        );
    }
}

export default Header;