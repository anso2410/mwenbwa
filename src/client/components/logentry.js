import React from "react";

function Logentry(props) {
    return (
        <li>
            <h3>
                {props.entry.tree_id.full_name} {props.entry.message}
            </h3>
        </li>
    );
}

export default Logentry;
