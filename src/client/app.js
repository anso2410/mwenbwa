/* becodeorg/mwenbwa
 *
 * /src/client/app.js - Client entry point
 *
 * coded by leny@BeCode
 * started at 18/05/2020
 */

import * as React from "react";
import ReactDOM from "react-dom";
import "./styles/normalize.css";
import "./styles/responsive.css";
import "./styles/main.css";
import MyWood from "./components/mywood";
import "bootstrap/dist/css/bootstrap.min.css";

// import Login from "./components/login";

ReactDOM.render(<MyWood />, document.querySelector("#app"));
