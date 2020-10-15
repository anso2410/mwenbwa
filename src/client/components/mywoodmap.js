import React from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import arbustum from "../../../data/working_arbust.json";
import "../styles/map.css";
import treeImg from "./img/treeImg.png";

function MyWoodMap(props) {
    const treeIcon = L.icon({
        iconUrl: treeImg,
        iconAnchor: [10, 0],
        popupAnchor: [16, 0],
        iconSize: [28, 37],
    });
    return (
        <Map
            id="leafletContainer"
            center={[50.6283, 5.5768]}
            zoom={17}
            minZoom={17}
            onViewportChanged={e => props.getTreesCoordinates(e)}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup disableClusteringAtZoom={18}>
                {props.treeCoordinates.map(tree => (
                    <Marker
                        icon={treeIcon}
                        key={tree._id}
                        // onclick={props.sendTreeId(tree._id.$oid)}
                        // onclick={e => console.log(tree._id)}
                        position={[
                            tree.location.coordinates[1],
                            tree.location.coordinates[0],
                        ]}>
                        <Popup>
                            <a
                                href={tree.wikipedia_page}
                                rel="noreferrer"
                                target="_blank">
                                <h4>{tree.full_name}</h4>
                            </a>
                            <p>{`Height: ${tree.size.height}m`}</p>
                            <p>{`Diameter: ${tree.size.diameter}cm`}</p>
                            <p>{`Price: ${tree.value} leaves`}</p>
                            <input
                                type="button"
                                onClick={() => props.sendTreeId(tree._id)}
                                // onClick={() =>
                                //     console.log(`the ID of tree is ${tree._id}`)
                                // }
                                value="Send ID to back"
                            />
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </Map>
    );
}

export default MyWoodMap;
