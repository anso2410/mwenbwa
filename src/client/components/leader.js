import React from "react";

function Leader(props) {
    return (
        <li>
            <h3>{props.leader.name}</h3>
            <p>Number of leaves : {props.leader.leaves}</p>
        </li>
    );
}

export default Leader;
