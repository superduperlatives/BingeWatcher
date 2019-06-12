import React from 'react';

// prints user's selected TV shows to the page
const UserList = (props) => {
    return (
        <ul className="showSelection">
            {props.showTitle.map((show, index) => {
                return (
                    <li key={index} className="titleVoteContent2" style={{ backgroundImage: `url(${show.background})` }}>
                        <div className="overlay"></div>
                        <h4>{show.title}</h4>
                        <div className="removeWrapper">
                            <button
                                className="removeButton"
                                onClick={() => props.removeShow(index)}>&#10006;
                            </button>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default UserList;
