import * as React from "react";

function Login() {
    return (
        <div className={"Login"}>
            <h1>Login</h1>
            <form action={"/hello"} method={"POST"}>
                <div>
                    <label htmlFor={"name"}>Name</label>
                    <input type={"text"} name={"username"} />
                </div>
                <div>
                    <label htmlFor={"email"}>Email</label>
                    <input type={"email"} name={"email"} />
                </div>
                <div>
                    <label htmlFor={"password"}>Password</label>
                    <input type={"text"} name={"password"} />
                </div>
                <div>
                    <label htmlFor={"color"}>Color</label>
                    <input type={"text"} name={"color"} />
                </div>
                <input type={"submit"} value={"Add Member"} />
            </form>
        </div>
    );
}

export default Login;
