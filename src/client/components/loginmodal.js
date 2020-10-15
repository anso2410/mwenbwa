/* eslint-disable react/jsx-max-depth */
import React from "react";
import treeImgLogin from "./img/flat-natural-background-with-landscape_23-2148250110.jpg";
import {Container, Row, Col} from "react-bootstrap";

function LoginModal(props) {
    return (
        <div className="container-size">
            {/* Change title depending on SignUp/LogIn */}
            <Container className="">
                <div className="card d-flex flex-column text-center">
                    <Row className="row-height">
                        <Col>
                            <div className="login-img">
                                <img src={treeImgLogin} alt=""/>
                            </div>
                        </Col>
                        <Col className="login-right-col">
                            <div className="login-modal">
                                <h2 className="title-login">
                                    {props.state.showSignup
                                        ? "Sign Up"
                                        : "Log In"}
                                </h2>
                                <p className="text-align-left margin-bottom-p dark-purple bold">
                                    Username
                                </p>
                                {props.state.showSignup && (
                                    <input
                                        type="text"
                                        name="username"
                                        id="login-modal-id"
                                        placeholder=""
                                        value={props.state.username}
                                        onChange={props.handleChange}
                                        required
                                        className="input-space input-border"
                                    />
                                )}
                                <p className="text-align-left margin-bottom-p dark-purple bold">
                                    Email
                                </p>
                                <input
                                    type="text"
                                    name="email"
                                    id="login-modal-id"
                                    placeholder="e-mail"
                                    value={props.state.email}
                                    onChange={props.handleChange}
                                    required
                                />
                                <p className="text-align-left margin-bottom-p dark-purple bold">
                                    Password
                                </p>
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
                                    // ID OR CLASSNAME? CHECK!
                                    <div id="text-align-left color-selector">
                                        <p className="bold text-align-left dark-purple">
                                            Pick a color&nbsp;
                                        </p>
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
                                {/* MANUAL MERGE STOPPED HERE */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
            <h2>{props.state.showSignup ? "Sign Up" : "Log In"}</h2>
            {props.state.showSignup && (
                <input
                    type="text"
                    name="username"
                    id="login-modal-id"
                    placeholder="username"
                    value={props.state.username}
                    onChange={props.handleChange}
                    required
                />
            )}
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
            {/* Show color selector IF signUp */}
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
                {/* Handle Login or Signup depending on showSignup state */}
                <input
                    type="button"
                    value={props.state.showSignup ? "Sign Up" : "Log In"}
                    onClick={
                        props.state.showSignup ? props.signUp : props.logIn
                    }
                    // onClick={
                    //     props.state.showSignup
                    //         ? props.signUp
                    //         : setTimeout(() => props.logIn, 3000)
                    // }
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
    );
}

export default LoginModal;
