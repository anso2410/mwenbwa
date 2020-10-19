import React from "react";
import treeImg from "./img/treeImg-purple.png";
import leafImg from "./img/leaf.png";
import treeWhiteIcon from "./img/top-tree-purple.png";

function TopBar(props) {
    return (
        <div className="top-bar-display">
            <div className="top-bar-button"></div>{/*
            <div className="top-bar bgc-prim">
                <img src={treeWhiteIcon} alt="" />
            </div>*/}
            <div className="info-bar">
                <div className="user-bubble">
                    <img
                        src={
                            props.state.user.avatar ||
                            "https://upload.wikimedia.org/wikipedia/commons/1/12/User_icon_2.svg"}></img>
                    <h3 className="game-title">{props.state.user.username}</h3>
                </div>
                <div className="info-bar-img-tree">
                    <img src={treeImg} className="treeImg"></img>
                    <p>{props.state.user.number_of_trees}</p>
                </div>
                <div className="info-bar-img-leaf">
                    <img src={leafImg} className="leafImg"></img>
                    <p>{props.state.user.number_of_leaves}</p>
                </div>
            </div>

        </div>
    );
}

export default TopBar;
