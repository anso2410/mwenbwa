import React from "react";
import treeImgLogin from "./img/flat-natural-background-with-landscape_23-2148250110.jpg";
import {Container, Row, Col} from "react-bootstrap";

function LoginModal(props) {
    return (
        <Container className="container-size">
            <div className="card d-flex flex-column text-center">
                <Row className="row-height">
                    <Col>
                        <div className="login-img">
                            <img src={treeImgLogin} alt=""/>
                        </div>
                    </Col>
                    <Col className="login-right-col">
                        <div className="login-modal">
                            {/* Change title depending on SignUp/LogIn */}
                            <div className="line-height-login">
                                <h2 className="title-login">{props.state.showSignup ? "Sign Up" : "Log In"}</h2>
                                <p className="text-align-left margin-bottom-p dark-purple bold">Email</p>
                                <input
                                        type="text"
                                        name="email"
                                        id="login-modal-id"
                                        placeholder=""
                                        value={props.state.email}
                                        onChange={props.handleChange}
                                        required
                                        className="input-space input-border"
                                />
                                <p className="text-align-left margin-bottom-p dark-purple bold">Password</p>
                                <input
                                    type="password"
                                    name="password"
                                    id="login-modal-email"
                                    placeholder=""
                                    value={props.state.password}
                                    onChange={props.handleChange}
                                    minLength="4"
                                    required
                                    className="input-space input-border"
                                />
                                {/* Show color selector IF signUp */}
                                {props.state.showSignup && (
                                    <div id="text-align-left color-selector" className="">
                                        <p className="bold text-align-left dark-purple">Pick a color&nbsp;</p>
                                        <input
                                            type="color"
                                            id="color-input"
                                            name="color"
                                            value={props.state.color}
                                            onChange={props.handleChange}
                                            className="text-align-left input-space"
                                        />
                                    </div>
                                )}
                            </div>
                            <div id="loginmodal-buttons">
                                {/* Handle Login or Signup depending on showSignup state */}
                                <input
                                    type="button"
                                    value={props.state.showSignup ? "Sign Up" : "Log In"}
                                    onClick={
                                        props.state.showSignup
                                            ? console.log("need to add signup function")
                                            : props.logIn
                                    }
                                    className="button-login"
                                />
                            </div>
                            <div id="toggle-signup-group">
                                <p class="light-purple">
                                    {props.state.showSignup
                                        ? "Already have an account?"
                                        : "No account yet?"}
                                </p>
                                <input
                                    id="toggle-signup"
                                    type="button"
                                    value={props.state.showSignup ? "Log In" : "Sign Up"}
                                    onClick={props.toggleSignup}
                                    className="signup-button-style dark-purple"
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
        /*<div className="card d-flex flex-column text-center">
            <div className="p-5 overflow">
                <img src={treeImgLogin} alt=""/>
            </div>
            <div className="p-5 card-body login-modal ">
                {/!* Change title depending on SignUp/LogIn *!/}
                <h2>{props.state.showSignup ? "Sign Up" : "Log In"}</h2>
                <input
                    type="text"
                    name="email"
                    id="login-modal-id"
                    placeholder="e-mail"
                    value={props.state.email}
                    onChange={props.handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    id="login-modal-email"
                    placeholder="password"
                    value={props.state.password}
                    onChange={props.handleChange}
                    minLength="4"
                    required
                />
                {/!* Show color selector IF signUp *!/}
                {props.state.showSignup && (
                    <div id="color-selector">
                        <p>pick a color :&nbsp;</p>
                        <input
                            type="color"
                            id="color-input"
                            name="color"
                            value={props.state.color}
                            onChange={props.handleChange}
                        />
                    </div>
                )}
                <div id="loginmodal-buttons">
                    {/!* Handle Login or Signup depending on showSignup state *!/}
                    <input
                        type="button"
                        value={props.state.showSignup ? "Sign Up" : "Log In"}
                        onClick={
                            props.state.showSignup
                                ? console.log("need to add signup function")
                                : props.logIn
                        }
                        className="button"
                    />
                </div>
                <div id="toggle-signup-group">
                    <p>
                        {props.state.showSignup
                            ? "Already have an account?"
                            : "No account yet?"}
                    </p>
                    <input
                        id="toggle-signup"
                        type="button"
                        value={props.state.showSignup ? "Log In" : "Sign Up"}
                        onClick={props.toggleSignup}
                    />
                </div>
            </div>
        </div>
*/
    );
}

export default LoginModal;
