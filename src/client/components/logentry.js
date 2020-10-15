import React from "react";

function Logentry(props) {
    return (
        <li>
            <h3 className="gamelog-entry">
                {props.entry.tree_id.given_name} {props.entry.message}
                {props.entry.user_id.username}
            </h3>
        </li>
    );
}

export default Logentry;
