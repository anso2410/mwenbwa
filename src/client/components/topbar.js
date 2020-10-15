import React from "react";
import treeImg from "./img/treeImg-purple.png";
import leafImg from "./img/leaf.png";
import treeWhiteIcon from "./img/top-tree-purple.png";
import crownIcon from "./img/crown-icon.png";
import rulesIcon from "./img/parchment-icon-white.png";
import historyIcon from "./img/history-icon.png";

function TopBar() {
    return (
        <div className="top-bar-display">
            <div className="top-bar-button">
                {/*<button className="button-infos" >
                    <img src={historyIcon} alt=""/>
                </button>*/}
                {/*<button className="button-leaderboard" >
                    <img src={crownIcon} alt=""/>
                </button>*/}
               {/* <button className="button-rules" >
                    <img src={rulesIcon} alt=""/>
                </button>*/}
            </div>
            <div className="top-bar bgc-prim">
                <img src={treeWhiteIcon} alt=""/>
            </div>
            <div className="info-bar">
                <div className="info-bar-img-tree">
                    <img src={treeImg} className="treeImg"></img>
                    <p>15</p>
                </div>
                <div className="info-bar-img-leaf">
                    <img src={leafImg} className="leafImg"></img>
                    <p>139</p>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
