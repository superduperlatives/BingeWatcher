import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase.js';
import Slider from 'react-slick';
import swal from 'sweetalert';

class UserList extends Component {
    render(){
        return(
            <div className="selectedTitles">
                {/* go into showTitle... map over it... for every show... add an index...? */}
                {this.props.showTitle.map((show, index) => {
                    return (
                        <li key={index}>
                            <p>{show.title}</p>
                            <button 
                                className="remove" 
                                onClick={()=> this.props.removeShow(index)}>Remove
                            </button>
                        </li>
                    )
                })}
            </div>
        )
    }
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
            // tv shows that the user is adding to their list 
            userTvShows: [],
            // binding the input for user title 
            userSubmitTitle: ""
        }
    }
    
    // this is where we start making the random API call
    randomNumber = (min, max) => {
        let num = Math.floor(Math.random() * (max - min)) + min;
        return num;
    }

    componentDidMount() {

        const starterShows = ['comedy', 'food', 'horror', 'action', 'drama', 'love', 'anime', 'disney']

        const randNum = this.randomNumber(0, starterShows.length)

        axios({
            method: 'GET',
            url: "http://api.tvmaze.com/search/shows",
            dataResponse: 'json',
            params: {
                q: starterShows[randNum]
            }
        }).then(results => {
            // only want the results that have an image
            const filteredStarterData = results.data.filter(item =>
                item.show.image != null)

            // console.log(filteredData)

            this.setState({
                showsArray: filteredStarterData
            })

        }).catch(error => {
            console.log('error')
        })
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
            // only want the results that have an image
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
        const title = e.target.getAttribute("data-title");
        const id = e.target.getAttribute("data-id");
        const summary = e.target.getAttribute("data-summary");
        const image = e.target.getAttribute("data-image");

        this.setState ({
            showsInfo: {
                title,
                id,
                summary,
                image
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

        if (this.state.userTvShows.length < 10) {
            const showTitle = this.state.showsInfo.title
            const showValue = 1

            // we're grabbing shit from showTitle & showValue and shoving it into variable info
            const info = { title: showTitle, value: showValue }
            // copy of userTVshows to update
            const titleArray = [...this.state.userTvShows]

            titleArray.push(info)

            this.setState({
                userTvShows: titleArray
            })
        } else {
            swal({
                title: "You may only add up to 10 shows to your list!",
                icon: "warning",
                button: "Nice.",
            });
        }
        
    }

    // function to remove a specific show (one show at a time) by index value
    removeShow = (showToRemove) => {
        const showTitle = [...this.state.userTvShows]

        showTitle.splice(showToRemove, 1)
        
        this.setState ({
            userTvShows: showTitle
        })
    }

    handleSubmitChange = event => {
        this.setState({
            userSubmitTitle: event.target.value
        })
    }        
    

    submitList = (e) => {
        e.preventDefault()

        const userChosenTitle = this.state.userSubmitTitle;

        // taking the entire list and title 
        const userConfirmedList = {
            title: userChosenTitle,
            userList: this.state.userTvShows
        }

        // reference to our firebase 
        const dbRef = firebase.database().ref();
        
        // push our complete user list to firebase
        dbRef.push(userConfirmedList)

        // clear the array for next list 
        this.setState({
            userTvShows: []
        })
    }

    render () {
        // settings for react-slick carousel
        const settings = {
            accessibility: true,
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 3500,
            centerMode: true,
            dots: true,
            infinite: true,
            speed: 750,
            slide: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            variableWidth: true,
        };

        return (
            <header className="hero wrapper">
                <div className="headerSearchBar">
                    <div className="appInfo">
                        <h1>Binge Watchers</h1>
                        <p className="slogan">Make a TV show list for your next binge</p>
                    </div>
                    <form 
                    action="" 
                    className="searchForm">
                        <label htmlFor="searchBar"></label>
                        <input  
                            id="searchBar" 
                            onChange={this.handleChange}
                            type="text">
                        </input>
                        <input 
                            onClick={this.handleSearch}
                            type="submit" 
                            value="Search"
                        />
                    </form>
                </div>
                <h1>

                </h1>
                <div className="showLists">
                    <div className="showResults">
                        <Slider {...settings} >
                        {/* map through the showsArray and for each item... we want to grab the data/ attributes...below? */}
                        {this.state.showsArray.map((item, key) => {
                            return <div 
                                    key={item.show.id} 
                                    className="showPoster"
                                    >
                                <img
                                    src={item.show.image.original}
                                    alt=""
                                    data-id={item.show.id}
                                    data-summary={item.show.summary}
                                    data-title={item.show.name}
                                    data-image={item.show.image.original}
                                    onClick={this.showDetails} 
                                />
                            </div>
                        })}
                        </Slider>
                    </div>
                    {/* this is where we are going to append the modal on click? */}
                    {this.state.isModalShown ? (
                        <div className="showModal">
                            <h2>{this.state.showsInfo.title}</h2>
                            <p>{this.state.showsInfo.summary}</p>
                            <div className="modal-image">
                                <img 
                                src={this.state.showsInfo.image} 
                                alt={this.state.showsInfo.title} 
                                />
                            </div>
                            <button 
                                className="clickClose" 
                                onClick={this.closeModal}>X
                            </button>
                            <button 
                                className="clickAdd" 
                                onClick={this.addToList}>Add to List
                            </button>
                        </div>
                    ) : null
                    }
                </div>
                <div className="listCreator">
                    <UserList
                        showTitle={this.state.userTvShows}
                        removeShow={this.removeShow}
                    />

                    <form 
                    action="" 
                    onSubmit={this.submitList}>
                        <label htmlFor="userListTitle"></label>
                        <input
                            id="userListTitle"
                            onChange={this.handleSubmitChange}
                            type="text"
                        />
                        <input
                            type="submit"
                            value="Submit List"
                        />
                    </form>
                </div>
            </header>
        )
    }
}

export default Header;