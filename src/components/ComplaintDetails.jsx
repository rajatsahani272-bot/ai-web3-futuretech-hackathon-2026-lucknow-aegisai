import React from "react";
import StatusBadge from "./StatusBadge";

export default function ComplaintDetails({ complaint, setPage }) {
  if (!complaint) return <div className="empty"><h2>No complaint selected</h2><button onClick={()=>setPage("Complaints")}>Go to Complaints</button></div>;

  return (
    <div>
      <div className="page-head"><div><h1>Complaint Details</h1><p>{complaint.id}</p></div><StatusBadge status={complaint.status}/></div>
      <div className="detail-grid">
        <section className="panel">
          <h2>{complaint.title}</h2>
          <div className="detail-photo">Civic Issue Photo</div>
          <div className="details">
            <p><b>Category:</b> {complaint.category}</p>
            <p><b>Location:</b> {complaint.location}</p>
            <p><b>Severity:</b> {complaint.severity}</p>
            <p><b>Reported:</b> {complaint.date}</p>
          </div>
        </section>
        <section className="panel">
          <h2>Update Status</h2>
          <select className="status-select">
            <option>{complaint.status}</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <textarea placeholder="Add an internal note..."/>
          <button className="primary-btn">Save Update</button>
          <button className="secondary-btn" onClick={()=>setPage("Complaints")}>Back to Complaints</button>
        </section>
      </div>
    </div>
  );
}