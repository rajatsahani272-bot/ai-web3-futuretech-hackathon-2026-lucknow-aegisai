import React from "react";

export default function StatCard({ icon, value, label, sub, cls, onClick }) {
  return (
    <div className={`stat-card ${cls}`} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-sub">{sub}</div>
      </div>
    </div>
  );
}