/* becodeorg/mwenbwa
 *
 * /src/client/app.js - Client entry point
 *
 * coded by leny@BeCode
 * started at 18/05/2020
 */

import * as React from "react";
import ReactDOM from "react-dom";
import "./scss/app.scss";

import App from "./components/main";
import L from "leaflet";

ReactDOM.render(<App />, document.querySelector("#app"));
