import React, { Component } from 'react';
import firebase from './firebase.js';
import swal from 'sweetalert';

class Main extends Component {
    constructor(){
        super()
        this.state = {
            displayList: [],
        }
    }

    // pulling data from firebase
    componentDidMount(){
        // reference to our firebase
        const dbRef = firebase.database().ref();
        // on value change in firebase, get updated data from database
        dbRef.on('value', (response) => {
            // the data from firebase
            const data = response.val()
            
            // an empty array to update the state
            const newState = [];
            
            // for community voting - for every list stored in firebase, arranges the TV shows on each user's list by value (votes). After the list has been sorted, pushes the list back to firebase to be stored in new order 
            for (let object in data) {
                let sortedArray = []
                // sorts the array by value
                sortedArray = data[object].userList.sort((a, b) => {
                    if (a.value > b.value) return -1;
                    if (a.value < b.value) return 1;
                    return 0;
                });
                // pushes the newly sorted array to firebase
                dbRef.child(object).update({
                    userList: sortedArray
                })
            }
            // grabs the user's submitted lists from firebase to store in state
            for (let key in data) {
                newState.push({
                    id: key,
                    userListObject: data[key]
                })
            }

            this.setState({
                displayList: newState
            })
        })
    }

    // on click, increases the value of specific TV show which updates in firebase so that the values can be sorted in display on the page by votes (values)
    valueIncrease = (event) => {
        // reference to the database
        const dbRef = firebase.database().ref(); 

        // reference to specific user list in firebase
        const firebaseKey = event.target.closest('.completeList').getAttribute('data-key');
        
        // copy of displayList in state to make modifications 
        const copy = [...this.state.displayList]
        
        // the following variables target the specific TV show on the specific list that the user would like to add a vote   
        const target = event.target.value
        const parentDiv = event.target.closest('.completeList').getAttribute('data-id');
        const keyValue = event.target.closest('.completeList').getAttribute('data-key');

        // grabs the current vote value
        let currentVoteValue = copy[parentDiv].userListObject.userList[target].value;
        
        // increments the current vote value by 1 
        const counter  = currentVoteValue + 1;
        copy[parentDiv].userListObject.userList[target].value = counter;
        
        // updates the state with the new array
        this.setState({
            displayList: copy,
        }, () => {
            // after the state has been set, updates firebase with new vote values
            const dbRef = firebase.database().ref()

            dbRef.once('value', (response) => {
                const newData = response.val()

                for (let key in newData) {
                    if (key === keyValue) {
                        dbRef.child(key).child('userList').child(target).update({
                            value: this.state.displayList[parentDiv].userListObject.userList[target].value
                        }) 
                    }
                }
            })
        })
    }

    // on click, decreases the value of specific TV show. Very similar to increase function.
    valueDecrease = (event) => {
        const firebaseKey = event.target.closest('.completeList').getAttribute('data-key');
        const dbRef = firebase.database().ref();
        const copy = [...this.state.displayList]
        const target = event.target.value
        const parentDiv = event.target.closest('.completeList').getAttribute('data-id');
        const keyValue = event.target.closest('.completeList').getAttribute('data-key');

        let currentVoteValue = copy[parentDiv].userListObject.userList[target].value;
        const counter = currentVoteValue - 1;

        // error handling so that user can not vote a TV show down to negative values
        if (currentVoteValue > 0) {
            copy[parentDiv].userListObject.userList[target].value = counter;
            this.setState({
                displayList: copy,
            }, () => {
                const dbRef = firebase.database().ref()

                dbRef.once('value', (response) => {
                    const newData = response.val()

                    for (let key in newData) {
                        if (key === keyValue) {
                            dbRef.child(key).child('userList').child(target).update({
                                value: this.state.displayList[parentDiv].userListObject.userList[target].value
                            })
                        }
                    }
                })
            })
        } else {
            swal({
                title: "Vote count cannot be less than zero",
                icon: "warning",
                button: "Nice.",
            });
        }
    }

    render(){
        return(
            <section className="communityList wrapper" id="communityList">
                <h2 className="communityListTitle">Community Lists</h2>
                <div className="communityListContent">
                    {this.state.displayList.map((list, index) => {
                        return(
                            <div 
                                className="completeList" 
                                data-id={index} 
                                data-key={list.id}
                                key={list.id}>
                                <h3>{list.userListObject.title}</h3>
                                <ul>
                                    {list.userListObject.userList.map((show, index)=> {
                                        return(
                                            <li 
                                            key={index} 
                                            className="titleVoteContent">
                                                <div 
                                                    className="showHeading"
                                                    style={{backgroundImage: `url(${show.background})`}}>
                                                    <h4>{show.title}</h4>
                                                    <div className="overlay"></div>
                                                </div>
                                                <div className="showRating">
                                                    <p>{show.value}</p>
                                                    <div className="votesButton">
                                                        <button
                                                            className="upvote"
                                                            onClick={this.valueIncrease}
                                                            value={index}>
                                                                &#128077; 
                                                        </button>
                                                        <button
                                                            className="downvote"
                                                            onClick={this.valueDecrease}
                                                            value={index}>
                                                                &#128078; 
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </section>
        )
    }
}

export default Main