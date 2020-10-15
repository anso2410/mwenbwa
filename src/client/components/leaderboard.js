import React from "react";
import Leader from "./leader";
import iconCrown from "./img/crown-icon.png";

function Leaderboard(props) {
    return (
        <div className="modal-div center-modal flex-col pad-med border bgc-prim">
            <div className="leaderboard-img">
                <img src={iconCrown} alt=""></img>
            </div>
            <div className="leaderboard-text">
                <h2>Leaderboard</h2>
                <ol className="leaderFlex">
                    {props.state.leaders.map(leader => (
                        <Leader key={leader._id} leader={leader} />
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default Leaderboard;