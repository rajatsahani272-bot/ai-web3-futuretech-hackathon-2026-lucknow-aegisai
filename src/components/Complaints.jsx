import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import StatusBadge from "./StatusBadge";

export default function Complaints({
  setPage,
  setSelected,
  filter,
  setFilter,
}) {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const response = await api.get("/complaints");

        setComplaints(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        setError("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesFilter =
        filter === "All" || c.status === filter;

      // Location can be an object
      const locationText =
        typeof c.location === "object"
          ? [
              c.location?.address,
              c.location?.name,
              c.location?.city,
              c.location?.area,
            ]
              .filter(Boolean)
              .join(" ")
          : c.location || "";

      const searchText = `
        ${c.title || ""}
        ${c.category || ""}
        ${locationText}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      return matchesFilter && matchesSearch;
    });
  }, [complaints, filter, search]);

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Complaints</h1>
          <p>Manage and track all civic complaints.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Complaint</th>
              <th>Category</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c) => {
                // Convert location object into readable text
                const locationText =
                  typeof c.location === "object"
                    ? [
                        c.location?.address,
                        c.location?.name,
                        c.location?.city,
                        c.location?.area,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    : c.location || "N/A";

                return (
                  <tr key={c._id || c.id}>
                    <td>{c._id || c.id}</td>

                    <td>
                      <b>{c.title || "Untitled"}</b>
                      <small>{c.date || ""}</small>
                    </td>

                    <td>
                      {typeof c.category === "object"
                        ? c.category?.name || "N/A"
                        : c.category || "N/A"}
                    </td>

                    <td>{locationText}</td>

                    <td>
                      <span
                        className={`severity ${
                          typeof c.severity === "string"
                            ? c.severity.toLowerCase()
                            : ""
                        }`}
                      >
                        {typeof c.severity === "object"
                          ? c.severity?.name || "N/A"
                          : c.severity || "N/A"}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={c.status} />
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelected(c);
                          setPage("Complaint Details");
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}