import React from "react";
import axios from "axios";
import Button from "./button";
import TopBar from "./topbar";
import Rules from "./rules";
import LoginModal from "./loginmodal";
import Leaderboard from "./leaderboard";
import Gamelog from "./gamelog";
import "../styles/overlay.css";

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
            color: "#FF0000",
            token: "",
            realUsername: "",
            realColor: "",
            gravatar: "",
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
    // componentDidMount() {
    //     axios
    //         .post(`http://localhost/api/tree`, {
    //             lat: 50.64327,
    //             lon: 5.5980396,
    //             zoom: 16,
    //         })
    //         .then(res => {
    //             console.log(res.data);
    //             // res.data.map(x => console.log(x));
    //         });
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
                    realUsername: res.data.user.username,
                    realColor: res.data.user.color,
                    gravatar: res.data.user.avatar,
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
                    realUsername: res.data.user.username,
                    realColor: res.data.user.color,
                    gravatar: res.data.user.avatar,
                    logged: true,
                    showLeaderboard: false,
                    showRules: true,
                    showGamelog: false,
                });
                console.log(this.state);
            })
            .catch(err => {
                console.log("Log In failed! Oh no!");
                console.log(data);
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
        axios
            .get(`http://localhost/api/gamelog`)
            .then(res => {
                this.setState({
                    gamelog: res.data.msg,
                });
            })
            .catch(err => {
                console.log(err);
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
                <TopBar />
                {this.state.logged && (
                    <>
                        <Button
                            value="Log Out"
                            handleClick={this.logOut}
                            className="button-logout"
                        />
                        <Button
                            value="Leaderboard"
                            handleClick={this.toggleLeaderboard}
                            className="button-leaderboard"
                        />
                        <Button
                            value="Game Rules"
                            name="showRules"
                            handleClick={this.toggleRules}
                            className="button-rules"
                        />
                        <Button
                            value="Game Log"
                            handleClick={this.toggleGamelog}
                            className="button-gamelog"
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
