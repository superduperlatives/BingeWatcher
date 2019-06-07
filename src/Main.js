import React, { Component } from 'react';
import firebase from './firebase.js'

class Main extends Component {
    constructor(){
        super()

        this.state = {
            displayList: [],
        }
    }

    // this is where we are pulling data from firebase.
    // we do not need to add anything else in here?
    componentDidMount(){
        // variable created to reference into firebase
        const dbRef = firebase.database().ref();

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
        })
    }

    // we need to find a way to go into the userList and for every index go into the value... set a default state to it? and then update that state everytime we click on it?

    // create a function to update the values on button click by using .update()
    // we need to make it where its on click ADD +1 to it
    valueIncrease = (event) => {
        const target = event.target.value
        // console.log(target)

        // variable create: event.target is the button we are clicking on... (upvote button). when we use .closest... we are going to go up the parent tree until it finds the element with the class .overHere. Once we find the element of .overHere... get the attribute of data-id and return a value to us?
        const parentDiv = event.target.closest('.overHere').getAttribute('data-id')
        // console.log(parentDiv)
        
        console.log(this.state.displayList[parentDiv].userListObject.userList[target])

        // target the object thats holding that value.
        // console.log(target, "+1")
    }

    render(){
        return(
            <div>
                {this.state.displayList.map((list, index) => {
                    return(
                        <div 
                        className="overHere" 
                        data-id={index} 
                        key={index}>
                            <h3>{list.userListObject.title}</h3>
                            <ul>
                                {list.userListObject.userList.map((show, index)=> {
                                    return(
                                        <li key={index}>
                                            <h3>{show.title}</h3>
                                            <button 
                                                className="upvote"
                                                onClick={this.valueIncrease}
                                                onChange={this.handleYayListen}
                                                value={index}>Love
                                            </button>
                                            <button 
                                                className="downvote"
                                                onClick={this.handleNayChange}>Hate
                                            </button>
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