import React, { Component } from 'react';
import firebase from './firebase.js'

class Main extends Component {
    constructor(){
        super()

        this.state = {
            displayList: []
        }
    }

    componentDidMount(){

        const dbRef = firebase.database().ref();

        dbRef.on('value', (response) => {

            const newState = [];

            const data = response.val()

            for (let key in data) {
                newState.push({
                    id: key,
                    userListObject: data[key]
                })
            }
            // console.log(data);
            

            this.setState({
                displayList: newState
            })
            console.log(this.state.displayList);
        })

        
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
                                        <li key={index}>{show.title}</li>
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