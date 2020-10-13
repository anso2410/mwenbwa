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
    componentDidMount() {
        let response = [];
        axios.get(`http://localhost/api/tree`).then(res => {
            console.log("it worked");
            response = res.data.msg;
            let filtered = response.filter(
                tree => tree.location.coordinates[1] <= 50.64333,
            );
            this.setState({
                trees: filtered,
            });
            setTimeout(console.log(response), 800);
            setTimeout(console.log(filtered), 1000);
        });
        // .post(`http://localhost/api/tree`, {
        //     lat: 50.64327,
        //     lon: 5.5980396,
        //     zoom: 17,
        // })
    }
    getTreesCoordinates(e) {
        const zoom = e.zoom;
        const coordinates = e.center;
        console.log(zoom);
        // let response = [];
        // condition pour ne charger qu'une fois
        // if (this.state.trees.length === 0) {
        //     axios
        //         .post(`http://localhost/api/tree`, {
        //             lat: 50.64327,
        //             lon: 5.5980396,
        //             zoom: zoom,
        //         })
        //         .then(res => {
        //             console.log("it worked");
        //             response = res.data.msg;
        //             this.setState({
        //                 trees: response,
        //             });
        //             console.log(this.state.trees);
        //         });
        // }
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
