import React from "react";
import treeWhiteIcon from "./img/top-tree-purple.png";
import crownIcon from "./img/crown-icon.png";
import rulesIcon from "./img/parchment-icon.png";
import infoIcon from "./img/profile-icon.png";

function TopBar() {
    return (
        <div className="top-bar-display">
            <div className="top-bar-button">
                <button className="button-infos" >
                    <img src={infoIcon} alt=""/>
                </button>
                <button className="button-leaderboard" >
                    <img src={crownIcon} alt=""/>
                </button>
                <button className="button-rules" >
                    <img src={rulesIcon} alt=""/>
                </button>
            </div>
            <div className="top-bar bgc-prim">
                <img src={treeWhiteIcon} alt=""/>
            </div>
        </div>
    );
}

export default TopBar;
