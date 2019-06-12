import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase.js';
import UserList from './UserList.js';
import Slider from 'react-slick';
import swal from 'sweetalert';
import FocusTrap from 'focus-trap-react'

class Header extends Component {
    constructor() {
        super();
        this.state = {
            // binding input of search bar
            userInput: "",
            // storing our user's search input
            userSearch: "",
            // data gathered from API 
            showsArray: [],
            // storing the data that will be printed to the DOM
            showsInfo: {},
            // controls the visibility of the modal
            isModalShown: false,
            // stores the TV shows that the user adds to their list
            userTvShows: [],
            // binding the input of user's list title
            userSubmitTitle: "",
            // stores the tv show ids of the user's list
            idArray: [],
            // controls the visibility of the list creator
            isListCreatorShown: false,
            // controls the default message of the list creator
            isEmptyList: true,
            // for accessibility 
            activeTrap: false
        }
    }
    
    // random number generator for listing tv shows 
    randomNumber = (min, max) => {
        let num = Math.floor(Math.random() * (max - min)) + min;
        return num;
    }

    // based on the random number generator, calls API with a random keyword to print TV shows to the DOM when the page loads
    componentDidMount() {
        const starterShows = ['comedy', 'food', 'horror', 'action', 'drama', 'love', 'anime', 'disney']
        const randNum = this.randomNumber(0, starterShows.length)
        // calls the API
        axios({
            method: 'GET',
            url: "https://api.tvmaze.com/search/shows",
            dataResponse: 'json',
            params: {
                q: starterShows[randNum]
            }
        }).then(results => {
            // only want the results that have an image and summary
            const filteredStarterData = results.data.filter(item =>
                item.show.image != null && item.show.summary != null)
            // store the filter data in state
            this.setState({
                showsArray: filteredStarterData
            })

        }).catch(error => {
            swal({
                title: "Sorry! We failed to get data back from our API at this time. Please check back later!",
                icon: "warning",
                button: "Try Again"
            });
        })
    }

    //binds the input
    handleChange = event => {
        this.setState({
            userInput: event.target.value
        })
    }

    // on click of the search button, stores user input in state and passes the user's input to the API call
    handleSearch = event => {
        event.preventDefault();
        // error handling - checks if user has left search field blank and throws an alert
        if (this.state.userInput === '') {
            swal({
                title: "Don't leave the text field empty!!",
                icon: "warning",
                button: "Nice.",
            });
        // if user has filled out the input, store user's search parameters in state and call API
        } else {
            const userQuery = this.state.userInput;

            this.setState({
                userSearch: userQuery
            }, () => {
                this.searchShows(this.state.userSearch)
            })
        }
    }

    // calls Api to get tv shows based on user's keyword search
    searchShows = (userSearch) => {
        axios({
            method: 'GET',
            url: "https://api.tvmaze.com/search/shows",
            dataResponse: 'json',
            params: {
                q: userSearch
            }
        }).then(results => {
            // if API cannot find any tv show matches based on user's search, ask user to search with another keyword
            if (results.data.length === 0) {
                swal({
                    title: `Sorry, we couldn't find any shows based on your search. Please try searching by another keyword`,
                    icon: "warning",
                    button: "Nice.",
                });
            // if API call returns results, filter out data that do not have an image or summary.
            } else {
                const filteredData = results.data.filter(item =>
                    item.show.image != null && item.show.summary != null);
                // store the filtered list in state
                this.setState({
                    showsArray: filteredData
                })
            }  
        }).catch(error => {
            swal({
                title: "Sorry! We failed to get data back from our API at this time. Please check back later!",
                icon: "warning",
                button: "Try Again"
            });
        })
    }

    // for accessibility - allows user to select a show on enter
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.showDetails(e)
        }
    }

    // on click of image, targets the specific data info for the clicked on show, stores the info in state and then calls the handleDisplayModal to print info on DOM
    showDetails = (e) => {
        const title = e.target.getAttribute("data-title");
        const id = e.target.getAttribute("data-id");
        const dataSummary = e.target.getAttribute("data-summary");
        const image = e.target.getAttribute("data-image");

        //regex to remove html tags embedded in tv show summaries
        const summary = dataSummary.replace(/<[^>]+>/g, '');

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

    // shows the modal on the DOM 
    handleDisplayModal = () => {
        this.setState({
            isModalShown: true,
            activeTrap: true
        })
    }

    // on click, hides the modal from the DOM
    closeModal = (e) => {
        e.preventDefault();
        this.setState({
            isModalShown: false,
            activeTrap: false
        })
    }

    // on click, shows the list creator section on section on the DOM
    openListCreator = (e) => {
        e.preventDefault();
        this.setState({
            isListCreatorShown: true
        })
    }

    // on click, takes user's selected TV show and adds the selected TV show's info to userTvShows array stored in state
    addToList = (e) => {
        e.preventDefault();

        // if user has less than 10 TV shows on their list (limits the user to selecting 10 TV shows per list)
        if (this.state.userTvShows.length < 10) {
            // store TV show's id for error handling (to ensure that the user does not add same TV show to their list twice)
            const idArrayCopy = [...this.state.idArray]

            if (!idArrayCopy.includes(this.state.showsInfo.id)) {
                idArrayCopy.push(this.state.showsInfo.id)
            
                // grabs the info about the clicked on show from showsInfo array in state
                const showTitle = this.state.showsInfo.title
                const showBackground = this.state.showsInfo.image

                // assigns the TV show an initial value of 1 for voting system
                const showValue = 1

                // creates an object with TV show's title, value and image
                const info = { title: showTitle, value: showValue, background: showBackground }

                // makes copy of userTvShows to push user's selected TV show
                const titleArray = [...this.state.userTvShows]
                titleArray.push(info)

                this.setState({
                    userTvShows: titleArray,
                    idArray: idArrayCopy,
                    isListCreatorShown: true,
                    isEmptyList: false
                });
            // if user has already added title to list, display sweet alert error
            } else {
                this.setState({
                    isModalShown: false
                });

                swal({
                    title: "Whoops you already this show to your list!",
                    icon: "warning",
                    button: "Nice.",
                });
            }
        // if user tries to add more than 10 shows to their list, display sweet alert error
        } else {
            this.setState({
                isModalShown: false
            });

            swal({
                title: "You may only add up to 10 shows to your list!",
                icon: "warning",
                button: "Nice.",
            });
        }
    }

    // removes a TV show off a user's list by passing in the index value of the show the user would like to remove
    removeShow = (showToRemove) => {
        // copy of user's TV show list to make modification
        const showTitle = [...this.state.userTvShows]

        // remove the TV show from the array
        showTitle.splice(showToRemove, 1)
        
        // update state with the new array
        this.setState ({
            userTvShows: showTitle
        })
    }

    // binding the input of the user's list title
    handleSubmitChange = (e) => {
        this.setState({
            userSubmitTitle: e.target.value
        })
    }        
    
    //on click, checks if the user completed the form correctly and then sends the user's completed list to firebase
    submitList = (e) => {
        e.preventDefault()
        // error handling - checks if user has added more than one TV show and entered a titled
        if (this.state.userTvShows.length !== 0 && this.state.userSubmitTitle !== '') {
            const userChosenTitle = this.state.userSubmitTitle;

            // takes user's entire list of TV shows and list title 
            const userConfirmedList = {
                title: userChosenTitle,
                userList: this.state.userTvShows
            }
            // reference to our firebase 
            const dbRef = firebase.database().ref();

            // push user's completed list to firebase
            dbRef.push(userConfirmedList)

            // clears the array for next list 
            this.setState({
                userTvShows: [],
                userSubmitTitle: '',
                isSubmittedShown: true,
            })

            // sweet alert confirmation that the user's list has been submitted and guides the user to check out the community lists
            swal({
                title: "Thank you for submitting your list! Vote for your favorite shows on our community boards below!",
                icon: "success",
                button: "Nice.",
            })
        // error handling - if user has not completed their list, display error message
        } else {
            swal({
                title: "Whoops! Looks like you didn't complete your list! Make sure to add at least one TV show and name your list.",
                icon: "warning",
                button: "Nice."
            }); 
        }
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
                {this.state.isModalShown ?
                    (<div className="heroOverlay"></div>) : null 
                }

                <div className="heroContent">
                    <div className="headerSearchBar">
                        <div className="appInfo">
                            <h1>Binge Watchers</h1>
                            <p className="slogan">Make a TV show list for your next binge</p>
                        </div>
                        
                        <form action="" className="searchForm">
                            <label htmlFor="searchBar"></label>
                            <input  
                                id="searchBar" 
                                onChange={this.handleChange}
                                type="text"
                                placeholder="eg. transformers, top gear, brooklyn 99... ">
                            </input>
                            <input  
                                onClick={this.handleSearch}
                                type="submit" 
                                value="Search">
                            </input>
                        </form>
                    </div>

                    <div className="showLists animated fadeInUp">
                        <div className="showResults">
                            <Slider {...settings}>
                                {this.state.showsArray.map ((item, key) => {
                                    return <div key={item.show.id} className="showPoster">
                                        <img
                                            src={item.show.image.original}
                                            alt=""
                                            data-id={item.show.id}
                                            data-summary={item.show.summary}
                                            data-title={item.show.name}
                                            data-image={item.show.image.original}
                                            onClick={this.showDetails} 
                                            onKeyPress={this.handleKeyPress}
                                            tabIndex="0"
                                        />
                                    </div>
                                })}
                            </Slider>
                        </div>
                    </div>

                    {this.state.isModalShown ? (
                        <FocusTrap>
                            <div className="modalWrapper">
                                <div className="showModal">
                                    <div className="modalImage">
                                        <img
                                            src={this.state.showsInfo.image}
                                            alt={this.state.showsInfo.title}
                                        />
                                    </div>
                                    <div className="modalText">
                                        <h2>{this.state.showsInfo.title}</h2>
                                        <p>{this.state.showsInfo.summary}</p>
                                        <div className="modalButtons">
                                            <button
                                                className="clickAdd"
                                                onClick={this.addToList}>
                                                Add to List
                                            </button>
                                            <button
                                                className="clickClose"
                                                onClick={this.closeModal}>
                                                X
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FocusTrap>
                    ) : null}
                    
                    {this.state.isListCreatorShown ? (
                        <div className="listCreator">
                            <div className="listWrapper animated fadeInUp">
                                <div className="formWrapper animated fadeInUp" id="formWrapper">
                                    <form
                                        className="listCreatorForm"
                                        action=""
                                        onSubmit={this.submitList}>
                                        <input
                                            id="userListTitle"
                                            onChange={this.handleSubmitChange}
                                            type="text"
                                            value={this.state.userSubmitTitle}
                                            placeholder="Name Your List"
                                        />
                                        <label htmlFor="userListTitle"></label>
                                        <input
                                            type="submit"
                                            value="Submit List"
                                        />
                                    </form>
                                    {this.state.isEmptyList ? (
                                        <div className="emptyList">
                                            <p>You have not added any TV shows to your list yet.</p>
                                            <p>Browse TV Shows by clicking on the titles and add to your list</p>
                                        </div>) : null
                                    }
                                    <div className="userWrapper">
                                        <UserList
                                            showTitle={this.state.userTvShows}
                                            removeShow={this.removeShow}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>) : 
                        <button className="startCreator" onClick={this.openListCreator}>Click here to Build Your List</button>
                    }
                </div>
            </header>
        )
    }
}

export default Header;
