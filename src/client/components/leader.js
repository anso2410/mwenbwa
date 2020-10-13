import React from "react";

function Leader(props) {
    return (
        <div>
            <h3>{props.leader.name}</h3>
            <p>Number of leaves : {props.leader.leaves}</p>
        </div>
    );
}

export default Leader;
