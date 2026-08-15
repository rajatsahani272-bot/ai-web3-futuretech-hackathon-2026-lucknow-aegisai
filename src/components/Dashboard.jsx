import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import StatusBadge from "./StatusBadge";
import StatCard from "./StatCard";
import MapPreview from "./MapPreview";

function Progress({ label, value, percent, cls }) {
  return (
    <div className="progress-box">
      <div>
        <span>{label}</span>
        <b>
          {value} ({percent}%)
        </b>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${cls}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({
  setPage,
  setSelected,
  setFilter,
  user,
}) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH COMPLAINTS
  // =========================
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");

        const data = response.data.data || response.data || [];

        setComplaints(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch dashboard complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // =========================
  // STATUS COUNTS
  // =========================
  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "pending"
  ).length;

  const assignedComplaints = complaints.filter(
    (c) => c.status === "assigned"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "resolved"
  ).length;

  // =========================
  // CITIZENS
  // =========================
  const citizens = useMemo(() => {
    const users = complaints
      .map((complaint) => complaint.user?._id)
      .filter(Boolean);

    return new Set(users).size;
  }, [complaints]);

  // =========================
  // STATUS PERCENTAGES
  // =========================
  const getPercentage = (count) => {
    if (totalComplaints === 0) return 0;

    return Number(((count / totalComplaints) * 100).toFixed(1));
  };

  const pendingPercent = getPercentage(pendingComplaints);
  const assignedPercent = getPercentage(assignedComplaints);
  const inProgressPercent = getPercentage(inProgressComplaints);
  const resolvedPercent = getPercentage(resolvedComplaints);

  // =========================
  // CATEGORY DATA
  // =========================
  const categoryData = useMemo(() => {
    const categoryMap = {};

    complaints.forEach((complaint) => {
      const category = complaint.category || "Other";

      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: getPercentage(count),
      }))
      .sort((a, b) => b.count - a.count);
  }, [complaints, totalComplaints]);

  // =========================
  // RECENT COMPLAINTS
  // =========================
  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [complaints]);

  // =========================
  // FILTER HANDLER
  // =========================
  const handleCardClick = (statusFilter) => {
    setFilter(statusFilter);
    setPage("Complaints");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <>
      {/* =========================
          HEADER
      ========================= */}
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, {user?.name || "User"}!
          </p>
        </div>

        <select className="date-select">
          <option>All Time</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {/* =========================
          STAT CARDS
      ========================= */}
      <div className="stats-grid">

        <StatCard
          icon="▦"
          value={totalComplaints}
          label="Total Complaints"
          sub="All complaints"
          cls="blue"
          onClick={() => handleCardClick("All")}
        />

        <StatCard
          icon="✓"
          value={resolvedComplaints}
          label="Resolved"
          sub={`${resolvedPercent}% of total`}
          cls="green"
          onClick={() => handleCardClick("resolved")}
        />

        <StatCard
          icon="◷"
          value={inProgressComplaints}
          label="In Progress"
          sub={`${inProgressPercent}% of total`}
          cls="purple"
          onClick={() => handleCardClick("in-progress")}
        />

        <StatCard
          icon="!"
          value={pendingComplaints}
          label="Pending"
          sub={`${pendingPercent}% of total`}
          cls="orange"
          onClick={() => handleCardClick("pending")}
        />

        <StatCard
          icon="♙"
          value={citizens}
          label="Citizens"
          sub="Registered complainants"
          cls="teal"
          onClick={() => setPage("Profile")}
        />

      </div>

      {/* =========================
          DASHBOARD GRID
      ========================= */}
      <div className="dashboard-grid">

        {/* =========================
            COMPLAINTS OVERVIEW
        ========================= */}
        <section className="panel">
          <div className="panel-title">
            <h2>Complaints Overview</h2>
          </div>

          <Progress
            label="Resolved"
            value={resolvedComplaints}
            percent={resolvedPercent}
            cls="green-bar"
          />

          <Progress
            label="In Progress"
            value={inProgressComplaints}
            percent={inProgressPercent}
            cls="blue-bar"
          />

          <Progress
            label="Assigned"
            value={assignedComplaints}
            percent={assignedPercent}
            cls="purple-bar"
          />

          <Progress
            label="Pending"
            value={pendingComplaints}
            percent={pendingPercent}
            cls="orange-bar"
          />
        </section>

        {/* =========================
            CATEGORY
        ========================= */}
        <section className="panel">

          <div className="panel-title">
            <h2>Complaints by Category</h2>
          </div>

          <div className="donut-wrap">

            <div
              className="donut"
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick("All")}
            >
              <strong>{totalComplaints}</strong>
              <small>Total</small>
            </div>

            <div className="category-list">

              {categoryData.length > 0 ? (
                categoryData.map((category, index) => (
                  <div
                    className="category-row"
                    key={category.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCardClick("All")}
                  >
                    <i className={`dot c${index + 1}`} />

                    <span>
                      {category.name}
                    </span>

                    <b>
                      {category.percentage}%
                    </b>
                  </div>
                ))
              ) : (
                <p>No category data available.</p>
              )}

            </div>
          </div>
        </section>

        {/* =========================
            RECENT COMPLAINTS
        ========================= */}
        <section className="panel">

          <div className="panel-title">

            <h2>Recent Complaints</h2>

            <button
              onClick={() => {
                setFilter("All");
                setPage("Complaints");
              }}
            >
              View All
            </button>

          </div>

          <div className="recent-list">

            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <button
                  className="recent-item"
                  key={complaint._id}
                  onClick={() => {
                    setSelected(complaint);
                    setPage("Complaint Details");
                  }}
                >
                  <span className="thumb">
                    ▣
                  </span>

                  <span className="recent-text">
                    <b>
                      {complaint.title}
                    </b>

                    <small>
                      {complaint.category}
                    </small>
                  </span>

                  <StatusBadge
                    status={complaint.status}
                  />
                </button>
              ))
            ) : (
              <p>No complaints available.</p>
            )}

          </div>
        </section>

        {/* =========================
            CITY MAP
        ========================= */}
        <section className="panel large">

          <div className="panel-title">

            <h2>City Map</h2>

            <button
              onClick={() => setPage("City Map")}
            >
              View Full Map
            </button>

          </div>

          <MapPreview
            complaints={complaints}
          />

        </section>

        {/* =========================
            COMPLAINT STATUS
        ========================= */}
        <section className="panel">

          <div className="panel-title">
            <h2>Complaints Status</h2>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleCardClick("resolved")
            }
          >
            <Progress
              label="Resolved"
              value={resolvedComplaints}
              percent={resolvedPercent}
              cls="green-bar"
            />
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleCardClick("in-progress")
            }
          >
            <Progress
              label="In Progress"
              value={inProgressComplaints}
              percent={inProgressPercent}
              cls="blue-bar"
            />
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleCardClick("pending")
            }
          >
            <Progress
              label="Pending"
              value={pendingComplaints}
              percent={pendingPercent}
              cls="orange-bar"
            />
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleCardClick("assigned")
            }
          >
            <Progress
              label="Assigned"
              value={assignedComplaints}
              percent={assignedPercent}
              cls="purple-bar"
            />
          </div>

        </section>

        {/* =========================
            MY PROFILE
        ========================= */}
        <section className="panel profile-mini">

          <div className="panel-title">
            <h2>My Profile</h2>
          </div>

          <div className="profile-row">

            <div className="avatar">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <h3>
                {user?.name || "User"}
              </h3>

              <p>
                {user?.role || "Administrator"}
              </p>
            </div>

          </div>

          <p>
            ✉ {user?.email || "Email not available"}
          </p>

          <p>
            ☎ {user?.phone || "Phone not available"}
          </p>

          <p>
            ⌖ {user?.location || "Location not available"}
          </p>

          <button
            className="full-btn"
            onClick={() => setPage("Profile")}
          >
            Edit Profile
          </button>

        </section>

      </div>
    </>
  );
}