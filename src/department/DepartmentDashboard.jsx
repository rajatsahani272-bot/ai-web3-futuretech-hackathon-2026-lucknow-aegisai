import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../api/axios.js";

import "./DepartmentDashboard.css";

export default function DepartmentDashboard({
  user,
  setPage,
  setSelected,
}) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/department/complaints");

      setComplaints(
        response.data.data || response.data || []
      );
    } catch (error) {
      console.error("Department complaints error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: complaints.length,

      resolved: complaints.filter(
        (c) => c.status === "resolved"
      ).length,

      progress: complaints.filter(
        (c) => c.status === "in-progress"
      ).length,

      pending: complaints.filter(
        (c) => c.status === "pending"
      ).length,

      assigned: complaints.filter(
        (c) => c.status === "assigned"
      ).length,

      highPriority: complaints.filter(
        (c) => c.priority === "high"
      ).length,
    };
  }, [complaints]);

  const categoryData = useMemo(() => {
    const data = {};

    complaints.forEach((complaint) => {
      const category = complaint.category || "Other";

      data[category] = (data[category] || 0) + 1;
    });

    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesFilter =
        filter === "All" ||
        complaint.status === filter;

      const location =
        complaint.location?.address ||
        complaint.location?.name ||
        complaint.location?.city ||
        "";

      const searchText = `
        ${complaint._id || ""}
        ${complaint.title || ""}
        ${complaint.category || ""}
        ${location}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [complaints, search, filter]);

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const getLocation = (complaint) => {
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
      "Location unavailable"
    );
  };

  const getStatusClass = (status) => {
    return status || "pending";
  };

  const getPriorityClass = (priority) => {
    return priority || "medium";
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    if (status === "in-progress") {
      return "In Progress";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getPercentage = (value) => {
    if (!stats.total) return 0;

    return Math.round(
      (value / stats.total) * 100
    );
  };

  const openComplaint = (complaint) => {
    setSelected(complaint);
    setPage("Department Complaint Details");
  };

  if (loading) {
    return (
      <div className="department-loading">
        <div className="department-loader"></div>
        <p>Loading department dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="department-empty">
        <div className="department-empty-icon">
          ⚠️
        </div>

        <h3>Unable to load dashboard</h3>

        <p>{error}</p>

        <button
          className="department-view-btn"
          onClick={fetchComplaints}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="department-dashboard">

      {/* Page heading */}

      <div className="department-dashboard-head">

        <div>
          <span className="department-welcome-badge">
            🏢 Department Panel
          </span>

          <h1>Department Dashboard</h1>

          <p>
            Welcome back,{" "}
            <strong>
              {user?.name || "Department"}
            </strong>
          </p>
        </div>

        <div className="department-code-box">
          <span>Department Code</span>

          <strong>
            {user?.departmentCode || "N/A"}
          </strong>
        </div>

      </div>


      {/* Statistics */}

      <div className="department-stats-grid">

        <div className="department-stat-card total">
          <div className="department-stat-icon">
            📋
          </div>

          <div>
            <span>Total Complaints</span>
            <h2>{stats.total}</h2>
            <small>
              All assigned complaints
            </small>
          </div>
        </div>


        <div className="department-stat-card resolved">
          <div className="department-stat-icon">
            ✓
          </div>

          <div>
            <span>Resolved</span>
            <h2>{stats.resolved}</h2>
            <small>
              {getPercentage(stats.resolved)}% of total
            </small>
          </div>
        </div>


        <div className="department-stat-card progress">
          <div className="department-stat-icon">
            ◔
          </div>

          <div>
            <span>In Progress</span>
            <h2>{stats.progress}</h2>
            <small>
              {getPercentage(stats.progress)}% of total
            </small>
          </div>
        </div>


        <div className="department-stat-card pending">
          <div className="department-stat-icon">
            !
          </div>

          <div>
            <span>Pending</span>
            <h2>{stats.pending}</h2>
            <small>
              {getPercentage(stats.pending)}% of total
            </small>
          </div>
        </div>


        <div className="department-stat-card priority">
          <div className="department-stat-icon">
            ⚠
          </div>

          <div>
            <span>High Priority</span>
            <h2>{stats.highPriority}</h2>
            <small>
              Requires attention
            </small>
          </div>
        </div>

      </div>


      {/* Overview + Categories */}

      <div className="department-overview-grid">

        <div className="department-panel overview-panel">

          <div className="department-panel-header">
            <div>
              <h2>Complaints Overview</h2>
              <p>
                Current complaint status
              </p>
            </div>
          </div>


          <div className="overview-list">

            <div className="overview-row">
              <div className="overview-label">
                <span className="overview-dot resolved-dot"></span>
                <span>Resolved</span>
              </div>

              <strong>
                {stats.resolved} (
                {getPercentage(stats.resolved)}%)
              </strong>

              <div className="overview-bar">
                <div
                  className="overview-fill resolved-fill"
                  style={{
                    width: `${getPercentage(
                      stats.resolved
                    )}%`,
                  }}
                ></div>
              </div>
            </div>


            <div className="overview-row">
              <div className="overview-label">
                <span className="overview-dot progress-dot"></span>
                <span>In Progress</span>
              </div>

              <strong>
                {stats.progress} (
                {getPercentage(stats.progress)}%)
              </strong>

              <div className="overview-bar">
                <div
                  className="overview-fill progress-fill"
                  style={{
                    width: `${getPercentage(
                      stats.progress
                    )}%`,
                  }}
                ></div>
              </div>
            </div>


            <div className="overview-row">
              <div className="overview-label">
                <span className="overview-dot assigned-dot"></span>
                <span>Assigned</span>
              </div>

              <strong>
                {stats.assigned} (
                {getPercentage(stats.assigned)}%)
              </strong>

              <div className="overview-bar">
                <div
                  className="overview-fill assigned-fill"
                  style={{
                    width: `${getPercentage(
                      stats.assigned
                    )}%`,
                  }}
                ></div>
              </div>
            </div>


            <div className="overview-row">
              <div className="overview-label">
                <span className="overview-dot pending-dot"></span>
                <span>Pending</span>
              </div>

              <strong>
                {stats.pending} (
                {getPercentage(stats.pending)}%)
              </strong>

              <div className="overview-bar">
                <div
                  className="overview-fill pending-fill"
                  style={{
                    width: `${getPercentage(
                      stats.pending
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

          </div>

        </div>


        <div className="department-panel category-panel">

          <div className="department-panel-header">
            <div>
              <h2>Complaints by Category</h2>
              <p>
                Most reported issue types
              </p>
            </div>
          </div>


          {categoryData.length === 0 ? (

            <div className="category-empty">
              <div>📊</div>
              <p>No category data available.</p>
            </div>

          ) : (

            <div className="category-list">

              {categoryData.map(
                ([category, count]) => (
                  <div
                    className="category-item"
                    key={category}
                  >
                    <div className="category-item-top">
                      <span>{category}</span>

                      <strong>{count}</strong>
                    </div>

                    <div className="category-bar">
                      <div
                        style={{
                          width: `${getPercentage(
                            count
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* Recent complaints */}

      <div className="department-panel recent-panel">

        <div className="department-panel-header">

          <div>
            <h2>Recent Complaints</h2>
            <p>
              Latest complaints assigned to your department
            </p>
          </div>

          <button
            className="department-outline-btn"
            onClick={() =>
              setPage("Department Complaints")
            }
          >
            View All
          </button>

        </div>


        {recentComplaints.length === 0 ? (

          <div className="department-empty compact">
            <div className="department-empty-icon">
              📋
            </div>

            <h3>No complaints available</h3>

            <p>
              No complaints have been assigned yet.
            </p>
          </div>

        ) : (

          <div className="recent-complaints-list">

            {recentComplaints.map((complaint) => (

              <div
                className="recent-complaint"
                key={
                  complaint._id ||
                  complaint.id
                }
              >

                <div className="recent-complaint-main">

                  <span className="recent-complaint-id">
                    #
                    {String(
                      complaint._id ||
                        complaint.id
                    ).slice(-6)}
                  </span>

                  <div>
                    <h3>
                      {complaint.title ||
                        "Untitled Complaint"}
                    </h3>

                    <p>
                      📍 {getLocation(complaint)}
                    </p>
                  </div>

                </div>


                <div className="recent-complaint-category">
                  {complaint.category ||
                    "Other"}
                </div>


                <span
                  className={`department-priority ${getPriorityClass(
                    complaint.priority
                  )}`}
                >
                  {complaint.priority ||
                    "medium"}
                </span>


                <span
                  className={`department-status ${getStatusClass(
                    complaint.status
                  )}`}
                >
                  {formatStatus(
                    complaint.status
                  )}
                </span>


                <button
                  className="department-view-btn"
                  onClick={() =>
                    openComplaint(complaint)
                  }
                >
                  View →
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* Lower section */}

      <div className="department-bottom-grid">

        <div className="department-panel map-panel">

          <div className="department-panel-header">

            <div>
              <h2>City Map</h2>
              <p>
                Complaint locations
              </p>
            </div>

            <button
              className="department-outline-btn"
              onClick={() =>
                setPage("City Map")
              }
            >
              View Full Map
            </button>

          </div>


          <div className="department-map-placeholder">

            <div className="map-road road-one"></div>
            <div className="map-road road-two"></div>
            <div className="map-road road-three"></div>

            <div className="map-label label-one">
              Lucknow
            </div>

            <div className="map-label label-two">
              Gomti Nagar
            </div>

            <div className="map-label label-three">
              Hazratganj
            </div>

            {complaints
              .slice(0, 6)
              .map((complaint, index) => (
                <button
                  key={
                    complaint._id ||
                    index
                  }
                  className="map-marker"
                  style={{
                    left: `${18 + index * 12}%`,
                    top: `${35 + (index % 3) * 18}%`,
                  }}
                  title={
                    complaint.title
                  }
                  onClick={() =>
                    openComplaint(
                      complaint
                    )
                  }
                >
                  ●
                </button>
              ))}

            {complaints.length === 0 && (
              <div className="map-empty">
                No complaint locations
              </div>
            )}

          </div>

        </div>


        <div className="department-panel profile-panel">

          <div className="department-panel-header">
            <div>
              <h2>Department Profile</h2>
              <p>
                Your department information
              </p>
            </div>
          </div>


          <div className="department-profile">

            <div className="department-profile-avatar">
              {(user?.name || "D")
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3>
              {user?.name ||
                "Department"}
            </h3>

            <span>
              Department
            </span>


            <div className="profile-info">

              <div>
                <small>Email</small>
                <strong>
                  {user?.email ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <small>Department Code</small>
                <strong>
                  {user?.departmentCode ||
                    "Not available"}
                </strong>
              </div>

            </div>


            <button
              className="department-profile-btn"
              onClick={() =>
                setPage("Profile")
              }
            >
              View Profile
            </button>

          </div>

        </div>

      </div>


      {/* Quick filter */}

      <div className="department-panel complaints-filter-panel">

        <div className="department-panel-header">

          <div>
            <h2>All Department Complaints</h2>
            <p>
              Search and filter complaints
            </p>
          </div>

          <span className="complaint-count">
            {filteredComplaints.length} complaints
          </span>

        </div>


        <div className="department-toolbar">

          <div className="department-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search complaint..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>


          <div className="department-filter">

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
            >
              <option value="All">
                All Complaints
              </option>

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

          </div>

        </div>


        {filteredComplaints.length > 0 && (

          <div className="department-table-wrapper">

            <table className="department-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredComplaints.map(
                  (complaint) => (

                    <tr
                      key={
                        complaint._id ||
                        complaint.id
                      }
                    >

                      <td>
                        <span className="department-complaint-id">
                          #
                          {String(
                            complaint._id ||
                              complaint.id
                          ).slice(-6)}
                        </span>
                      </td>

                      <td>
                        <div className="department-complaint-title">
                          {complaint.title ||
                            "Untitled Complaint"}
                        </div>
                      </td>

                      <td>
                        {complaint.category ||
                          "Other"}
                      </td>

                      <td>
                        <div className="department-location">
                          📍{" "}
                          {getLocation(
                            complaint
                          )}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`department-priority ${getPriorityClass(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority ||
                            "medium"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`department-status ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {formatStatus(
                            complaint.status
                          )}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          complaint.createdAt
                        )}
                      </td>

                      <td>
                        <button
                          className="department-view-btn"
                          onClick={() =>
                            openComplaint(
                              complaint
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}