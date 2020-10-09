/* becodeorg/mwenbwa
 *
 * /src/client/components/hello.js - Hello Component
 *
 * coded by leny@BeCode
 * started at 18/05/2020
 */

import * as React from "react";
import MyWoodMap from "./mywoodmap";
import Overlay from "./overlay";

const MyWood = () => (
    <div>
        <Overlay />
        <MyWoodMap />
    </div>
);

export default MyWood;
