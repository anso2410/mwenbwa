import React from "react";
import treeImg from "./img/treeImg.png";
import leafImg from "./img/leaf.png";

function TopBar() {
    return (
        <div className="top-bar bgc-prim">
            <h2 className="game-title">Username</h2>
            <img src={treeImg} className="treeImg"></img>
            <p>15</p>
            <img src={leafImg} className="leafImg"></img>
            <p>139</p>
        </div>
    );
}

export default TopBar;
