import axios from "axios";

function GetTrees(coordinates, zoom) {
    console.log("you got some trees V2");
    console.log(coordinates);
    console.log(zoom);
    let response = [];
    axios
        .post(`http://localhost/api/tree`, {
            lat: 50.64327,
            lon: 5.5980396,
            zoom: 16,
        })
        .then(res => {
            console.log("it worked");
            response = res.data;
            // res.data.map(x => console.log(x));
            console.log(response.msg);
        });
}

export default GetTrees;
