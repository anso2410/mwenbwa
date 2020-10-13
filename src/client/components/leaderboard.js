import React from "react";
import Leader from "./leader";

function Leaderboard(props) {
    return (
        <div className="leaderboard center-modal flex-col pad-med border bgc-prim">
            <h1>Leaderboard</h1>
            <div className="leaderFlex">
                {props.state.leaders.map(leader => (
                    <Leader key={leader.id} leader={leader} />
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;
