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
            tokenCopy: "",
            userId: {},
            trees: [],
            filteredTrees: [],
        };
        this.getTreesCoordinates = this.getTreesCoordinates.bind(this);
    }
    componentDidMount() {
        // test
        let center = [50.6283, 5.5768];
        let latMin = center[0] - 0.003;
        let latMax = center[0] + 0.003;
        let lonMin = center[1] - 0.007;
        let lonMax = center[1] + 0.007;
        // endtest
        let response = [];
        axios.get(`http://localhost/api/tree`).then(res => {
            console.log("it worked");
            response = res.data.msg;
            let filtered = response.filter(
                tree =>
                    tree.location.coordinates[0] > lonMin &&
                    tree.location.coordinates[0] < lonMax &&
                    tree.location.coordinates[1] > latMin &&
                    tree.location.coordinates[1] < latMax,
            );
            this.setState({
                trees: response,
                filteredTrees: filtered,
            });
        });
        // .post(`http://localhost/api/tree`, {
        //     lat: 50.64327,
        //     lon: 5.5980396,
        //     zoom: 17,
        // })
        let data = {
            headers: {
                "x-auth-token":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWY4NWJhZWMyYzA3ODIwN2Y3YTA0MmEyIn0sImlhdCI6MTYwMjU5OTY2OCwiZXhwIjoxNjAyNjg2MDY4fQ.G7HzoFpI_f3IYeNhskOcLgfXjJlbKwhaBBzCsqIzhv0",
                "content-type": "application/json",
            },
        };
        axios
            .get(`http://localhost/api/user`, data)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log("X AUTH FAILED! Bhuuu");
            });
    }
    getTreesCoordinates(e) {
        // const zoom = e.zoom;
        const coordinates = e.center;
        let latMin = coordinates[0] - 0.003;
        let latMax = coordinates[0] + 0.003;
        let lonMin = coordinates[1] - 0.007;
        let lonMax = coordinates[1] + 0.007;
        let filtered = this.state.trees.filter(
            tree =>
                tree.location.coordinates[0] > lonMin &&
                tree.location.coordinates[0] < lonMax &&
                tree.location.coordinates[1] > latMin &&
                tree.location.coordinates[1] < latMax,
        );
        this.setState({
            filteredTrees: filtered,
        });
    }
    sendTreeId(id) {
        console.log(`the ID of tree is ${id}`);
        let data = {
            headers: {
                "x-auth-token":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWY4NmI1ZjY0NzllODQwMTZmYWI2N2M0In0sImlhdCI6MTYwMjY3MDg2MSwiZXhwIjoxNjAyNzU3MjYxfQ.zdY4DLD8l5XbD-nBqFSlc1O3dqOtfI6eRFLWhSakQGs",
                "content-type": "application/json",
            },
            body: {
                userId: "5f86b5f6479e84016fab67c4",
                treeId: id,
            },
        };
        axios
            .get(`http://localhost/api/tree/buyTree`, data)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log("Couldn't send ID to back");
            });
    }
    render() {
        return (
            <div>
                <Overlay />
                <MyWoodMap
                    getTreesCoordinates={this.getTreesCoordinates}
                    treeCoordinates={this.state.filteredTrees}
                    sendTreeId={this.sendTreeId}
                />
            </div>
        );
    }
}

export default MyWood;
