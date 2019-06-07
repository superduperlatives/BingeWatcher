import React, { Component } from 'react';
import firebase from './firebase.js'

class Main extends Component {
    constructor(){
        super()

        this.state = {
            displayList: [],
            userVote: ""
        }
    }

    // this is where we are pulling data from firebase.
    componentDidMount(){
        // variable created to reference into firebase
        const dbRef = firebase.database().ref();

        // 
        dbRef.on('value', (response) => {
            // variable to pull data from firebase so we can shove it into newState's box
            const newState = [];

            // response from firebase, which will be shoved into the data variable?
            const data = response.val()

            // let every key in firebase..state. we want to push the following data: id/ userListObject...
            for (let key in data) {
                newState.push({
                    id: key,
                    userListObject: data[key]
                })
            }

            // we update the state so we can call it/ render it 
            this.setState({
                displayList: newState
            })

            // dbRef.orderByValue().on("value", function (snapshot) {
            //     snapshot.forEach(function (data) {
            //         console.log("heheeh" + data.id + data.userListObject)
            //     })
            // })
        })
    }

    // create a function to track the number of likes
    handleYayListen = (event) => {
        this.setState = ({
            userVote: event.target.value
        })
        console.log("+1")
    }

    // create a function... everytime the like button is clicked... add +1 to it
    handleYayChange = () => {
        console.log("Yay, liked!")
    }

    // create a function... everytime the like button is clicked again subtrack -1 to it?
    handleNayChange = () => {
        console.log("Nay, disliked!")
    }

    render(){
        return(
            <div>
                {this.state.displayList.map((list, index) => {
                    return(
                        <div key={index}>
                            <h3>{list.userListObject.title}</h3>
                            <ul>
                                {list.userListObject.userList.map((show, index)=> {
                                    return(
                                        <li key={index}>
                                            <h3>{show.title}</h3>
                                            <button 
                                            className="upvote"
                                            onClick={this.handleYayChange}
                                            onChange={this.handleYayListen}>Love</button>
                                            <button 
                                            className="downvote"
                                            onClick={this.handleNayChange}>Hate</button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        
                    )
                })}
            </div>
            
        )
    }
}

export default Main