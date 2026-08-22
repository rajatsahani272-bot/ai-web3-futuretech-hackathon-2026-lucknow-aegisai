import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const LUCKNOW_CENTER = [26.8467, 80.9462];

const createMarkerIcon = (status, priority) => {
  let color = "#f59e0b";

  if (status === "resolved") {
    color = "#22c55e";
  } else if (status === "in-progress") {
    color = "#3b82f6";
  } else if (status === "assigned") {
    color = "#8b5cf6";
  }

  if (priority === "high") {
    color = "#ef4444";
  }

  return L.divIcon({
    className: "fixmycity-marker-wrapper",
    html: `
      <div
        class="fixmycity-marker"
        style="--marker-color: ${color};"
      >
        <div class="marker-pulse"></div>
        <div class="marker-dot"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

function FitComplaints({ complaints }) {
  const map = useMap();

  useEffect(() => {
    const locations = complaints
      .filter((complaint) => {
        const lat = Number(
          complaint?.location?.latitude
        );

        const lng = Number(
          complaint?.location?.longitude
        );

        return (
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        );
      })
      .map((complaint) => [
        Number(complaint.location.latitude),
        Number(complaint.location.longitude),
      ]);

    if (locations.length === 0) {
      map.setView(LUCKNOW_CENTER, 12);
      return;
    }

    if (locations.length === 1) {
      map.setView(locations[0], 15);
      return;
    }

    const bounds = L.latLngBounds(locations);

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }, [complaints, map]);

  return null;
}

export default function MapPreview({
  complaints = [],
}) {
  return (
    <div className="fixmycity-map-container">
      <MapContainer
        center={LUCKNOW_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={true}
        className="fixmycity-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitComplaints
          complaints={complaints}
        />

        {complaints.map((complaint) => {
          const latitude = Number(
            complaint?.location?.latitude
          );

          const longitude = Number(
            complaint?.location?.longitude
          );

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            return null;
          }

          return (
            <Marker
              key={complaint._id}
              position={[
                latitude,
                longitude,
              ]}
              icon={createMarkerIcon(
                complaint.status,
                complaint.priority
              )}
            >
              <Popup>
                <div className="complaint-popup">
                  <div className="popup-header">
                    <div>
                      <span className="popup-category">
                        {complaint.category ||
                          "Complaint"}
                      </span>

                      <h3>
                        {complaint.title}
                      </h3>
                    </div>

                    <span
                      className={`popup-priority ${
                        complaint.priority ||
                        "medium"
                      }`}
                    >
                      {complaint.priority ||
                        "medium"}
                    </span>
                  </div>

                  <p className="popup-description">
                    {complaint.description}
                  </p>

                  <div className="popup-status-row">
                    <span
                      className={`popup-status ${
                        complaint.status
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  {complaint.location
                    ?.address && (
                    <div className="popup-location">
                      <span>📍</span>

                      <span>
                        {
                          complaint.location
                            .address
                        }
                      </span>
                    </div>
                  )}

                  {complaint.user && (
                    <div className="popup-user">
                      <strong>
                        Reported by
                      </strong>

                      <span>
                        {complaint.user.name}
                      </span>
                    </div>
                  )}

                  <div className="popup-coordinates">
                    {latitude.toFixed(5)}
                    {" , "}
                    {longitude.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="map-live-badge">
        <span className="live-dot"></span>
        Live Complaint Map
      </div>

      <div className="map-count-badge">
        <strong>
          {complaints.length}
        </strong>

        <span>Complaints</span>
      </div>
    </div>
  );
}