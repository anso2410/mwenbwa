import React from "react";
import treeImg from "./img/treeImg-purple.png";
import leafImg from "./img/leaf.png";
import treeWhiteIcon from "./img/top-tree-purple.png";

function TopBar(props) {
    return (
<<<<<<< HEAD
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
=======
        <div className="top-bar-display">
            <div className="top-bar-button">
            </div>
            <div className="top-bar bgc-prim">
                <img src={treeWhiteIcon} alt=""/>
            </div>
            <div className="info-bar">
                <div className="info-bar-img-tree">
                    <img src={treeImg} className="treeImg"></img>
                    <p>{props.state.user.number_of_trees}</p>
                </div>
                <div className="info-bar-img-leaf">
                    <img src={leafImg} className="leafImg"></img>
                    <p>{props.state.user.number_of_leaves}</p>
                </div>
            </div>
            <div className="user-bubble">
                <img
                    src={
                        props.state.user.avatar ||
                        "https://upload.wikimedia.org/wikipedia/commons/1/12/User_icon_2.svg"}></img>
                <h2 className="game-title">{props.state.user.username}</h2>
            </div>
>>>>>>> Kim
        </div>

  /*  <div className="top-bar bgc-prim">
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
    </div>*/
    );
}

export default TopBar;
