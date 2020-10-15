import React from "react";
import axios from "axios";
import Button from "./button";
import TopBar from "./topbar";
import Rules from "./rules";
import LoginModal from "./loginmodal";
import Leaderboard from "./leaderboard";
import "../styles/overlay.css";

class Overlay extends React.Component {
    constructor() {
        super();
        this.state = {
            logged: false,
            showSignup: false,
            showLeaderboard: false,
            showRules: false,
            email: "",
            password: "",
            color: "#b55c9c",
            token: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleSignup = this.toggleSignup.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.toggleLeaderboard = this.toggleLeaderboard.bind(this);
        this.toggleRules = this.toggleRules.bind(this);
        this.closeModals = this.closeModals.bind(this);
    }
    // componentDidMount() {
    //     console.log("component did mount");
    //     axios.get(`https://jsonplaceholder.typicode.com/posts`).then(res => {
    //         res.data.map(x => console.log(x));
    //     });
    // }
    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    }
    toggleSignup() {
        this.setState({
            showSignup: !this.state.showSignup,
        });
    }
    logIn() {
        this.setState({
            logged: true,
            showRules: true,
        });
    }
    logOut() {
        this.setState({
            logged: false,
            showLeaderboard: false,
            showRules: false,
        });
    }
    toggleLeaderboard() {
        this.setState({
            showLeaderboard: !this.state.showLeaderboard,
            showRules: false,
        });
    }
    toggleRules() {
        this.setState({
            showRules: !this.state.showRules,
            showLeaderboard: false,
        });
    }
    closeModals() {
        this.setState({
            showRules: false,
            showLeaderboard: false,
        });
    }
    render() {
        return (
            <div id="overlay">
                {/* Show DarkenMap if a modal is open (NB: not logged=show login modal) */}
                {(!this.state.logged ||
                    this.state.showLeaderboard ||
                    this.state.showRules) && (
                    <div
                        id="darken-map"
                        // onClick close all modals if Logged (not logged=>can't close login modal)
                        onClick={
                            this.state.logged ? this.closeModals : undefined
                        }
                    />
                )}
                <TopBar />
                {this.state.logged && (
                    <>
                        <Button
                            value={<img src={exitIcon} alt=''/>}
                            handleClick={this.logOut}
                            className="button-logout"
                        />
                        <Button
                            value="Leaderboard"
                            handleClick={this.toggleLeaderboard}
                            className=""
                        />
                        <Button
                            value="Game Rules"
                            name="showRules"
                            handleClick={this.toggleRules}
                            className=""
                        />
                    </>
                )}
                {this.state.showLeaderboard && (
                    <Leaderboard state={this.state} />
                )}
                {this.state.showRules && <Rules />}
                {!this.state.logged && (
                    <LoginModal
                        state={this.state}
                        handleChange={this.handleChange}
                        toggleSignup={this.toggleSignup}
                        logIn={this.logIn}
                    />
                )}
            </div>
        );
    }
}

export default Overlay;
