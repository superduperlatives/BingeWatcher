import React, { Component } from 'react';

class UserList extends Component {
    render() {
        return (
            <ul className="showSelection">
                {/* go into showTitle... map over it... for every show... add an index...? */}
                {this.props.showTitle.map((show, index) => {
                    return (
                        <li key={index} style={{ backgroundImage: `url(${show.background})` }}>
                            <p>{show.title}</p>
                            <button
                                className="removeButton"
                                onClick={() => this.props.removeShow(index)}>
                            </button>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

export default UserList;
