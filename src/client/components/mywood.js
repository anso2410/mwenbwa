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
import axios from "axios";
// import getTrees from "./axios/gettrees";

class MyWood extends React.Component {
    constructor() {
        super();
        this.state = {
            trees: [],
        };
        this.getTreesCoordinates = this.getTreesCoordinates.bind(this);
    }
    getTreesCoordinates(e) {
        const zoom = e.zoom;
        const coordinates = e.center;
        console.log(coordinates);
        let response = [];
        // condition pour ne charger qu'une fois
        if (this.state.trees.length === 0) {
            axios
                .post(`http://localhost/api/tree`, {
                    lat: 50.64327,
                    lon: 5.5980396,
                    zoom: 16,
                })
                .then(res => {
                    console.log("it worked");
                    response = res.data.msg;
                    this.setState({
                        trees: response,
                    });
                    console.log(this.state.trees);
                });
        }
    }
    render() {
        return (
            <div>
                <Overlay />
                <MyWoodMap
                    getTreesCoordinates={this.getTreesCoordinates}
                    treeCoordinates={this.state.trees}
                />
            </div>
        );
    }
}

export default MyWood;
