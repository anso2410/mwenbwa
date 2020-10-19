import React from "react";
import Logentry from "./logentry";
import historyIcon from "./img/history-icon.png"

function Gamelog(props) {
    return (
        <div className="modal-div center-modal flex-col pad-med border bgc-prim">
            <div className="gamelog-img">
                <img src={historyIcon} alt=""></img>
            </div>
            <div className="gamelog-text">
                <h2>Game Log</h2>
                <ul className="gamelogFlex">
                    {props.state.gamelog.map(entry => (
                        <Logentry key={entry._id} entry={entry} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Gamelog;
