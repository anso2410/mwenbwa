import React from "react";
import treeImg from "./img/treeImg.png";
import leafImg from "./img/leaf.png";

function TopBar(props) {
    return (
        <div className="top-bar bgc-prim">
            <img
                src={
                    props.state.user.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/1/12/User_icon_2.svg"
                }></img>
            <h2 className="game-title">{props.state.user.username}</h2>
            <img src={treeImg} className="treeImg"></img>
            <p>{props.state.user.number_of_trees}</p>
            <img src={leafImg} className="leafImg"></img>
            <p>{props.state.user.number_of_leaves}</p>
        </div>
    );
}

export default TopBar;
