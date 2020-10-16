import React from "react";
import axios from "axios";
import Button from "./button";
import TopBar from "./topbar";
import Rules from "./rules";
import LoginModal from "./loginmodal";
import Leaderboard from "./leaderboard";
import Gamelog from "./gamelog";
import "../styles/overlay.css";
import exitIcon from "./img/exit-icon .png";
import crownIcon from "./img/crown-icon.png";
import rulesIcon from "./img/parchment-icon-white.png";
import historyIcon from "./img/history-icon.png";

class Overlay extends React.Component {
    constructor() {
        super();
        this.state = {
            logged: false,
            showSignup: false,
            showLeaderboard: false,
            showGamelog: false,
            showRules: false,
            showLoader: false,
            username: "",
            email: "",
            password: "",
            color: "#b55c9c",
            token: "",
            user: {},
            leaders: [],
            gamelog: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleSignup = this.toggleSignup.bind(this);
        this.signUp = this.signUp.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.toggleLeaderboard = this.toggleLeaderboard.bind(this);
        this.toggleRules = this.toggleRules.bind(this);
        this.toggleGamelog = this.toggleGamelog.bind(this);
        this.closeModals = this.closeModals.bind(this);
    }
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
    signUp() {
        const data = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            color: this.state.color,
        };
        const config = {
            headers: {
                "content-type": "application/json",
            },
        };
        axios
            .post(`http://localhost/api/user/signup`, data, config)
            .then(res => {
                this.setState({
                    token: res.data.token,
                    user: res.data.user,
                    logged: true,
                    showLeaderboard: false,
                    showRules: true,
                    showGamelog: false,
                });
                console.log(this.state);
            })
            .catch(err => {
                console.log("Sign Up failed! Oh no!");
            });
    }
    logIn() {
        const data = {
            email: this.state.email,
            password: this.state.password,
        };
        const config = {
            headers: {
                "content-type": "application/json",
            },
        };
        axios
            .post(`http://localhost/api/user/login`, data, config)
            .then(res => {
                this.setState({
                    token: res.data.token,
                    user: res.data.user,
                    logged: true,
                    showLeaderboard: false,
                    showRules: true,
                    showGamelog: false,
                });
                console.log(res.data);
            })
            .catch(err => {
                console.log("Log In failed! Oh no!");
                console.log(err);
            });
    }
    logOut() {
        this.setState({
            logged: false,
            showLeaderboard: false,
            showRules: false,
            showGamelog: false,
        });
    }
    toggleLeaderboard() {
        this.setState({
            showLeaderboard: !this.state.showLeaderboard,
            showRules: false,
            showGamelog: false,
        });
        axios
            .get(`http://localhost/api/leaderboard/trees`)
            .then(res => {
                this.setState({
                    leaders: res.data.users,
                });
                console.log(res.data.users);
            })
            .catch(err => {
                console.log("Couldn't get Leaderboard");
            });
    }
    toggleRules() {
        this.setState({
            showRules: !this.state.showRules,
            showLeaderboard: false,
            showGamelog: false,
        });
    }
    toggleGamelog() {
        this.setState({
            showGamelog: !this.state.showGamelog,
            showLeaderboard: false,
            showRules: false,
        });
        const data = {
            headers: {
                "x-auth-token": this.state.token,
                "content-type": "application/json",
            },
        };
        console.log("the data is :");
        console.log(data);
        axios
            .get(`http://localhost/api/gamelog`, data)
            .then(res => {
                this.setState({
                    gamelog: res.data.msg,
                });
                console.log("gameLog is :");
                console.log(this.state.gamelog);
            })
            .catch(err => {
                console.log(err);
                console.log("GameLog Request failed");
            });
    }
    closeModals() {
        this.setState({
            showRules: false,
            showLeaderboard: false,
            showGamelog: false,
        });
    }
    render() {
        return (
            <div id="overlay">
                {/* Show DarkenMap if a modal is open (NB: not logged=show login modal) */}
                {(!this.state.logged ||
                    this.state.showLeaderboard ||
                    this.state.showGamelog ||
                    this.state.showRules) && (
                    <div
                        id="darken-map"
                        // onClick close all modals if Logged (not logged=>can't close login modal)
                        onClick={
                            this.state.logged ? this.closeModals : undefined
                        }
                    />
                )}
                {this.state.showLoader && <div className="loader"></div>}
                {this.state.logged && (
                    <>
                        <TopBar state={this.state} />
                        <Button
                            value={<img src={exitIcon} alt="" />}
                            handleClick={this.logOut}
                            className="button-logout"
                        />
                        <Button
                            value={<img src={crownIcon} alt="" />}
                            handleClick={this.toggleLeaderboard}
                            className="button-leaderboard"
                        />
                        <Button
                            value={<img src={rulesIcon} alt="" />}
                            name="showRules"
                            handleClick={this.toggleRules}
                            className="button-rules"
                        />
                        <Button
                            value={<img src={historyIcon} alt="" />}
                            handleClick={this.toggleGamelog}
                            className="button-infos"
                        />
                    </>
                )}
                {this.state.showLeaderboard && (
                    <Leaderboard state={this.state} />
                )}
                {this.state.showGamelog && <Gamelog state={this.state} />}
                {this.state.showRules && <Rules />}
                {!this.state.logged && (
                    <LoginModal
                        state={this.state}
                        handleChange={this.handleChange}
                        toggleSignup={this.toggleSignup}
                        logIn={this.logIn}
                        signUp={this.signUp}
                    />
                )}
            </div>
        );
    }
}

export default Overlay;
