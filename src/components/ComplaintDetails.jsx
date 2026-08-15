import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import api from "../api/axios.js";

export default function ComplaintDetails({ complaint, setPage }) {
  const [status, setStatus] = useState(complaint?.status || "Pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!complaint) {
    return (
      <div className="empty">
        <h2>No complaint selected</h2>

        <button onClick={() => setPage("Complaints")}>
          Go to Complaints
        </button>
      </div>
    );
  }

  const location =
    typeof complaint.location === "object"
      ? complaint.location?.address ||
        complaint.location?.name ||
        "Location available"
      : complaint.location || "Location not available";

  const handleSaveUpdate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await api.patch(
        `/complaints/${complaint._id || complaint.id}`,
        {
          status,
          note,
        }
      );

      setMessage("Complaint updated successfully.");

    } catch (error) {
      console.error("Failed to update complaint:", error);

      setMessage(
        error.response?.data?.message ||
        "Failed to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Complaint Details</h1>
          <p>
            ID: {complaint._id || complaint.id}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="detail-grid">

        {/* Complaint Details */}
        <section className="panel">
          <h2>{complaint.title}</h2>

          <div className="detail-photo">
            Civic Issue Photo
          </div>

          <div className="details">

            <p>
              <b>Category:</b>{" "}
              {complaint.category || "N/A"}
            </p>

            <p>
              <b>Location:</b>{" "}
              {location}
            </p>

            <p>
              <b>Severity:</b>{" "}
              {complaint.severity || "N/A"}
            </p>

            <p>
              <b>Reported:</b>{" "}
              {complaint.date ||
                complaint.createdAt ||
                "N/A"}
            </p>

            <p>
              <b>Description:</b>{" "}
              {complaint.description || "N/A"}
            </p>

          </div>
        </section>


        {/* Update Complaint */}
        <section className="panel">

          <h2>Update Status</h2>

          <select
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="resolved">
              Resolved
            </option>
            <option value="assigned">
              Assigned
            </option>
          </select>
          


          <textarea
            placeholder="Add an internal note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />


          {message && (
            <p>
              {message}
            </p>
          )}


          <button
            className="primary-btn"
            onClick={handleSaveUpdate}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Update"}
          </button>


          <button
            className="secondary-btn"
            onClick={() => setPage("Complaints")}
          >
            Back to Complaints
          </button>

        </section>
      </div>
    </div>
  );
}