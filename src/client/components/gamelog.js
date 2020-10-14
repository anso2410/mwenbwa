import React from "react";

function Gamelog(props) {
    return (
        <div className="gamelog center-modal flex-col pad-med border bgc-prim">
            <h1>Game Log</h1>
            <ul className="gamelogFlex">
                {props.state.gamelog.map(entry => (
                    <>
                        <li>You mapped one entry</li>
                    </>
                ))}
            </ul>
        </div>
    );
}

export default Gamelog;
