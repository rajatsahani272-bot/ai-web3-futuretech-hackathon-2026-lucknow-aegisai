import React from "react";

export default function MapPreview() {
  return (
    <div className="map">
      <div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="road r4"/>
      {["p1","p2","p3","p4","p5"].map((p,i)=><span className={`pin ${p}`} key={i}>●</span>)}
      <div className="map-label l1">Hazratganj</div><div className="map-label l2">Gomti Nagar</div><div className="map-label l3">Indira Nagar</div>
      <div className="map-center">Lucknow</div>
    </div>
  );
}