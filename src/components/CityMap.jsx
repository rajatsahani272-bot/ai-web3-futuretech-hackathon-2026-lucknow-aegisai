import React from "react";
import MapPreview from "./MapPreview";

export default function CityMap() {
  return (
    <div>
      <div className="page-head"><div><h1>City Map</h1><p>Interactive complaint locations across Lucknow.</p></div></div>
      <div className="panel full-map">
        <MapPreview/>
        <div className="map-side">
          <h2>Map Legend</h2><p>🟢 Resolved</p><p>🔵 In Progress</p><p>🟠 Pending</p><hr/>
          <h3>Hotspots</h3><p>Hazratganj – 18 complaints</p><p>Gomti Nagar – 14 complaints</p><p>Indira Nagar – 11 complaints</p>
        </div>
      </div>
    </div>
  );
}