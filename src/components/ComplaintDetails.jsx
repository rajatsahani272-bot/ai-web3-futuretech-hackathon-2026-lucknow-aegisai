import React, {
  useEffect,
  useState,
} from "react";

import StatusBadge from "./StatusBadge";
import api from "../api/axios.js";

export default function ComplaintDetails({
  complaint,
  setPage,
}) {
  const [status, setStatus] =
    useState(
      complaint?.status ||
        "pending"
    );

  const [note, setNote] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [showImage, setShowImage] =
    useState(false);

  const [location, setLocation] =
    useState(
      "Finding location..."
    );

  const [departments, setDepartments] =
    useState([]);

  const [
    departmentLoading,
    setDepartmentLoading,
  ] = useState(true);

  const [
    assignedDepartment,
    setAssignedDepartment,
  ] = useState(
    complaint?.department?._id ||
      complaint?.department ||
      ""
  );

  useEffect(() => {
    const loadDepartments =
      async () => {
        try {
          setDepartmentLoading(
            true
          );

          const response =
            await api.get(
              "/department/"
            );

          console.log(
            "Departments:",
            response.data
          );

          setDepartments(
            response?.data?.data ||
              []
          );
        } catch (error) {
          console.error(
            "Failed to load departments:",
            error
          );

          setDepartments([]);

          setMessage(
            error.response?.data
              ?.message ||
              "Failed to load departments."
          );
        } finally {
          setDepartmentLoading(
            false
          );
        }
      };

    loadDepartments();
  }, []);

  useEffect(() => {
    const getLocationName =
      async () => {
        const latitude =
          complaint?.location
            ?.latitude;

        const longitude =
          complaint?.location
            ?.longitude;

        if (
          latitude === undefined ||
          longitude === undefined
        ) {
          setLocation(
            "Location unavailable"
          );
          return;
        }

        if (
          complaint.location
            ?.address
        ) {
          setLocation(
            complaint.location
              .address
          );
          return;
        }

        try {
          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`
            );

          const data =
            await response.json();

          const address =
            data.address || {};

          const area =
            address.neighbourhood ||
            address.suburb ||
            address.city_district ||
            address.district ||
            address.village ||
            address.town;

          const city =
            address.city ||
            address.municipality ||
            address.county;

          const state =
            address.state;

          const postcode =
            address.postcode;

          const country =
            address.country;

          const parts = [
            area,
            city,
            state,
            postcode,
            country,
          ].filter(Boolean);

          setLocation(
            [
              ...new Set(parts),
            ].join(", ") ||
              data.display_name ||
              "Location unavailable"
          );
        } catch (error) {
          console.error(
            "Location error:",
            error
          );

          setLocation(
            "Location unavailable"
          );
        }
      };

    if (complaint) {
      getLocationName();
    }
  }, [complaint]);

  const handleSaveUpdate =
    async () => {
      try {
        setSaving(true);
        setMessage("");

        const complaintId =
          complaint._id ||
          complaint.id;

        if (!assignedDepartment) {
          setMessage(
            "Please select a department."
          );
          return;
        }

        await api.patch(
          `/admin/complaints/${complaintId}/assign`,
          {
            departmentId:
              assignedDepartment,
          }
        );

        await api.patch(
          `/admin/complaints/${complaintId}/status`,
          {
            status,
          }
        );

        setMessage(
          "Complaint updated successfully."
        );
      } catch (error) {
        console.error(
          "Update complaint error:",
          error
        );

        setMessage(
          error.response?.data
            ?.message ||
            "Failed to update complaint."
        );
      } finally {
        setSaving(false);
      }
    };

  if (!complaint) {
    return (
      <div className="empty">
        <h2>
          No complaint selected
        </h2>

        <button
          onClick={() =>
            setPage(
              "Complaints"
            )
          }
        >
          Go to Complaints
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            Complaint Details
          </h1>

          <p>
            ID:{" "}
            {complaint._id ||
              complaint.id}
          </p>
        </div>

        <StatusBadge
          status={status}
        />
      </div>

      <div className="detail-grid">
        <section className="panel">
          <h2>
            {complaint.title ||
              "Untitled Complaint"}
          </h2>

          <div className="detail-photo">
            {complaint.image ? (
              <img
                src={complaint.image}
                alt={
                  complaint.title ||
                  "Complaint"
                }
                className="complaint-detail-image"
                onClick={() =>
                  setShowImage(true)
                }
              />
            ) : (
              <div className="no-image">
                No image uploaded
              </div>
            )}
          </div>

          <div className="details">
            <p>
              <b>
                Category:
              </b>{" "}
              {complaint.category ||
                "N/A"}
            </p>

            <p>
              <b>
                Location:
              </b>{" "}
              {location}
            </p>

            <p>
              <b>
                Severity:
              </b>{" "}
              {complaint.priority ||
                complaint.severity ||
                "N/A"}
            </p>

            <p>
              <b>
                Reported:
              </b>{" "}
              {complaint.createdAt
                ? new Date(
                    complaint.createdAt
                  ).toLocaleString(
                    "en-IN"
                  )
                : "N/A"}
            </p>

            <p>
              <b>
                Description:
              </b>{" "}
              {complaint.description ||
                "N/A"}
            </p>
          </div>
        </section>

        <section className="panel">
          <h2>
            Update Complaint
          </h2>

          <label className="field-label">
            Status
          </label>

          <select
            className="status-select"
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

          <label className="field-label">
            Assign Department
          </label>

          <select
            className="status-select"
            value={
              assignedDepartment
            }
            disabled={
              departmentLoading
            }
            onChange={(e) =>
              setAssignedDepartment(
                e.target.value
              )
            }
          >
            <option value="">
              {departmentLoading
                ? "Loading departments..."
                : "Select department"}
            </option>

            {!departmentLoading &&
              departments.length ===
                0 && (
                <option
                  value=""
                  disabled
                >
                  No departments available
                </option>
              )}

            {departments.map(
              (department) => (
                <option
                  key={
                    department._id
                  }
                  value={
                    department._id
                  }
                >
                  {department.name}
                  {department.departmentCode
                    ? ` (${department.departmentCode})`
                    : ""}
                </option>
              )
            )}
          </select>

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
            <p>{message}</p>
          )}

          <button
            className="primary-btn"
            onClick={
              handleSaveUpdate
            }
            disabled={
              saving ||
              departmentLoading
            }
          >
            {saving
              ? "Saving..."
              : "Save Update"}
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              setPage(
                "Complaints"
              )
            }
          >
            Back to Complaints
          </button>
        </section>
      </div>

      {showImage && (
        <div
          className="image-modal"
          onClick={() =>
            setShowImage(false)
          }
        >
          <button
            className="image-modal-close"
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
            className="image-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          />
        </div>
      )}
    </div>
  );
}