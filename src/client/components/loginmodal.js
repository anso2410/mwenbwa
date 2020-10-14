import React from "react";

function LoginModal(props) {
    return (
        <form
            action={
                props.state.showSignup
                    ? "http://localhost/api/user/signup"
                    : "http://localhost/api/user/login"
            }
            method="POST"
            className="login-modal center-modal flex-col pad-med border bgc-prim">
            {/* Change title depending on SignUp/LogIn */}
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
                    type="submit"
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
        </form>
    );
}

export default LoginModal;
