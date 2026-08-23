import React, { useState } from "react";
import "./DepartmentDashboard.css";
import api from "../api/axios.js";

export default function DepartmentComplaintDetails({
  complaint,
  setPage,
}) {
  const [status, setStatus] = useState(
    complaint?.status || "pending"
  );

  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showImage, setShowImage] = useState(false);

  if (!complaint) {
    return (
      <div className="department-empty">
        <div className="department-empty-icon">
          📋
        </div>

        <h3>No complaint selected</h3>

        <p>
          Please select a complaint first.
        </p>

        <button
          className="department-view-btn"
          onClick={() =>
            setPage("Department Complaints")
          }
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  const getLocation = () => {
    if (!complaint.location) {
      return "Location unavailable";
    }

    if (typeof complaint.location === "string") {
      return complaint.location;
    }

    return (
      complaint.location.address ||
      complaint.location.name ||
      complaint.location.city ||
      "Location available"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const formatStatus = (value) => {
    if (value === "in-progress") {
      return "In Progress";
    }

    if (!value) {
      return "Pending";
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await api.patch(
        `/complaints/${complaint._id}`,
        {
          status,
          note,
        }
      );

      const updatedComplaint =
        response.data.data;

      Object.assign(
        complaint,
        updatedComplaint
      );

      setMessage(
        "Complaint updated successfully."
      );

      setNote("");

    } catch (error) {
      console.error(
        "Failed to update complaint:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  const user = complaint.user || {};

  return (
    <div className="department-dashboard">

      <div className="department-main">

        <div className="department-page-head">

          <div>
            <h1>
              Complaint Details
            </h1>

            <p>
              Complaint #
              {String(
                complaint._id
              ).slice(-8)}
            </p>
          </div>

          <button
            className="department-view-btn"
            onClick={() =>
              setPage(
                "Department Complaints"
              )
            }
          >
            ← Back
          </button>

        </div>


        <div className="department-detail-grid">

          <div>

            <div className="department-panel">

              <div className="department-panel-header">

                <div>
                  <h2>
                    {complaint.title ||
                      "Untitled Complaint"}
                  </h2>

                  <p>
                    Reported on{" "}
                    {formatDate(
                      complaint.createdAt
                    )}
                  </p>
                </div>

                <span
                  className={`department-status ${
                    complaint.status ||
                    "pending"
                  }`}
                >
                  {formatStatus(status)}
                </span>

              </div>


              <div className="department-detail-content">

                <div className="department-image-section">

                  {complaint.image ? (
                    <img
                      src={complaint.image}
                      alt={
                        complaint.title ||
                        "Complaint"
                      }
                      className="department-complaint-image"
                      onClick={() =>
                        setShowImage(true)
                      }
                    />
                  ) : (
                    <div className="department-no-image">
                      <span>📷</span>
                      <p>
                        No image uploaded
                      </p>
                    </div>
                  )}

                  {complaint.image && (
                    <p className="department-image-hint">
                      Click image to view full size
                    </p>
                  )}

                </div>


                <div className="department-description">

                  <h3>
                    Description
                  </h3>

                  <p>
                    {complaint.description ||
                      "No description provided."}
                  </p>

                </div>


                <div className="department-info-grid">

                  <div>
                    <span>
                      Category
                    </span>

                    <strong>
                      {complaint.category ||
                        "Other"}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Priority
                    </span>

                    <strong
                      className={`department-priority ${
                        complaint.priority ||
                        "medium"
                      }`}
                    >
                      {complaint.priority ||
                        "medium"}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      📍 {getLocation()}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {formatStatus(status)}
                    </strong>
                  </div>

                </div>

              </div>

            </div>


            <div className="department-panel department-user-panel">

              <div className="department-panel-header">

                <div>
                  <h2>
                    Reported By
                  </h2>

                  <p>
                    Citizen information
                  </p>
                </div>

              </div>


              <div className="department-user-details">

                <div className="department-user-large-avatar">
                  {(user.name ||
                    "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    {user.name ||
                      "User"}
                  </h3>

                  <p>
                    {user.email ||
                      "Email unavailable"}
                  </p>

                  {user.phone && (
                    <p>
                      📞 {user.phone}
                    </p>
                  )}
                </div>

              </div>

            </div>

          </div>


          <div>

            <div className="department-panel">

              <div className="department-panel-header">

                <div>
                  <h2>
                    Update Complaint
                  </h2>

                  <p>
                    Change complaint status
                  </p>
                </div>

              </div>


              <div className="department-update-content">

                <label>
                  Complaint Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="assigned">
                    Assigned
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                </select>


                <label>
                  Internal Note
                </label>

                <textarea
                  placeholder="Add an internal note..."
                  value={note}
                  onChange={(e) =>
                    setNote(
                      e.target.value
                    )
                  }
                />


                {message && (
                  <div className="department-message">
                    {message}
                  </div>
                )}


                <button
                  className="department-save-btn"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Update"}
                </button>

              </div>

            </div>


            <div className="department-panel department-timeline-panel">

              <div className="department-panel-header">

                <div>
                  <h2>
                    Complaint Status
                  </h2>

                  <p>
                    Current complaint progress
                  </p>
                </div>

              </div>


              <div className="department-status-flow">

                <div
                  className={
                    status === "pending" ||
                    status === "assigned" ||
                    status === "in-progress" ||
                    status === "resolved"
                      ? "active"
                      : ""
                  }
                >
                  <span>✓</span>
                  <strong>
                    Submitted
                  </strong>
                </div>


                <div
                  className={
                    status === "assigned" ||
                    status === "in-progress" ||
                    status === "resolved"
                      ? "active"
                      : ""
                  }
                >
                  <span>✓</span>
                  <strong>
                    Assigned
                  </strong>
                </div>


                <div
                  className={
                    status === "in-progress" ||
                    status === "resolved"
                      ? "active"
                      : ""
                  }
                >
                  <span>✓</span>
                  <strong>
                    In Progress
                  </strong>
                </div>


                <div
                  className={
                    status === "resolved"
                      ? "active"
                      : ""
                  }
                >
                  <span>✓</span>
                  <strong>
                    Resolved
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {showImage && complaint.image && (
        <div
          className="department-image-modal"
          onClick={() =>
            setShowImage(false)
          }
        >

          <button
            className="department-image-close"
            onClick={() =>
              setShowImage(false)
            }
          >
            ×
          </button>

          <img
            src={complaint.image}
            alt={
              complaint.title ||
              "Complaint"
            }
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>
      )}

    </div>
  );
}