import React from "react";

function Logentry(props) {
    return (
        <li>
            <h3>{props.entry.user_id._id} is there something before??</h3>
        </li>
    );
}

export default Logentry;
