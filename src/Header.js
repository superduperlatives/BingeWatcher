import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase.js'



class UserList extends Component {
    
        render(){
            return(
                <div className="selectedTitles">
                    {this.props.showTitle.map((show, index) => {
                        return (
                            <li key={index}>
                                <p>{show.title}</p>
                                <button className="Remove" onClick={()=> this.props.removeShow(index)} value={show} >Remove</button>
                            </li>
                        )
                    })}
                </div>
            )
        }
    // removeSelectedShow = (event) => {
    //     preventDefault(event);
    //     console.log("remove selected show TEST")
    //     const buttonTarget = event.target.value
    //     console.log(buttonTarget)
    // }
}

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

            userTvShows: [],

            userSubmitTitle: ""
            
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
        const image = e.target.getAttribute("data-image");
        const value = e.target.getAttribute("value");

        this.setState ({
            showsInfo: {
                title,
                id,
                summary,
                image, 
                value
            },
        }, () => {
            this.handleDisplayModal();
        })
    }

    handleDisplayModal = () => {
        this.setState({
            isModalShown:true
        })
    }

    closeModal = (e) => {
        e.preventDefault();
        this.setState({
            isModalShown: false
        })
    }

    addToList = (e) => {
        e.preventDefault();
        const title = this.state.showsInfo.title
        const value = this.state.showsInfo.value

        const info = { title: this.state.showsInfo.title, value:1}

        const value = 0

        const shows = {showTitle:title, showValue:value}
        console.log(shows)
        const titleArray = [...this.state.userTvShows]
        
<<<<<<< HEAD
        titleArray.push(info)
        // titleArray.push(value.value)

        this.setState ({
            userTvShows: titleArray
        })
=======
        // titleArray.push(title)

        // this.setState ({
        //     userTvShows:titleArray
        // })
>>>>>>> 76ffb54731e9b959c8d3c750512ab79dd95f17ea
    }

    removeShow = (showToRemove) => {
        const showTitle = [...this.state.userTvShows]

            showTitle.splice(showToRemove, 1)
        

        this.setState ({
            userTvShows: showTitle
        })
        
        console.log(this.state.userTvShows)

    }

    handleSubmitChange = event => {
        this.setState({
            userSubmitTitle: event.target.value
        })
    }        
    

    submitList = (e) => {
        e.preventDefault()
        
        const userChosenTitle = this.state.userSubmitTitle;

        const userConfirmedList = {
            title: userChosenTitle,
            userList: this.state.userTvShows
        }

        const dbRef = firebase.database().ref();
        // console.log('dbref=', dbRef)
        // console.log('userShows', this.state.userTvShows)
        dbRef.push(userConfirmedList)

        this.setState({
            userTvShows: []
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
                                data-value={0}
                                data-image={item.show.image.original}
                                onClick={this.showDetails}/>
                            </div>
                        }) }

                    </div>
                    {/* this is where we are going to append the modal on click? */}

                    {this.state.isModalShown ? (
                        <div className="showModal">
                            <h2>{this.state.showsInfo.title}</h2>
                            <p>{this.state.showsInfo.summary}</p>
                            <div className="modal-image">
                                <img src={this.state.showsInfo.image} alt={this.state.showsInfo.title}/>
                            </div>
                            <button className="clickClose" onClick={this.closeModal}>X</button>
                            <button className="clickAdd" onClick={this.addToList}>Add to List</button>
                        </div>
                        
                    ) : null
                    }
                    
                    <div className="listCreator">
                        <form action="" onSubmit={this.submitList}>
                            <label htmlFor="userListTitle"></label>
                            <input type="text" id="userListTitle" onChange={this.handleSubmitChange}/>
                            <UserList showTitle={this.state.userTvShows} removeShow={this.removeShow} />
                            <input type="submit" value="Submit List"/>
                        </form>
                    </div>

                </div>
            </header>

        );
    }
}

export default Header;