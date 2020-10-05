import * as React from "react";
import {Map, Marker, TileLayer} from "react-leaflet";
import Trees from "../../../data/arbustums02.json";

export default function Test() {
    return (
        <Map center={[50.632557, 5.579666]} zoom={12}>
            <TileLayer
                url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                attribution={
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }
            />

            {Trees.map(tree => (
                <Marker
                    key={(tree.x_lambert72, tree.y_lambert72, tree.arbotag)}
                    position={[tree.geoloc.lat, tree.geoloc.lon]}
                />
            ))}
        </Map>
    );
}
