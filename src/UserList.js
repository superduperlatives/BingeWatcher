import React from 'react';

const UserList = (props) => {
    return (
        <ul className="showSelection">
            {props.showTitle.map((show, index) => {
                return (
                    <li key={index} style={{ backgroundImage: `url(${show.background})` }}>
                        <p>{show.title}</p>
                        <button
                            className="removeButton"
                            onClick={() => props.removeShow(index)}>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}

export default UserList;
