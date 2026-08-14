import React, { useState, useMemo } from "react";
import { complaintsData } from "../data/complaintsData";
import StatusBadge from "./StatusBadge";

export default function Complaints({ setPage, setSelected, filter, setFilter }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => complaintsData.filter(c =>
    (filter === "All" || c.status === filter) &&
    `${c.title} ${c.category} ${c.location}`.toLowerCase().includes(search.toLowerCase())
  ), [filter, search]);

  return (
    <div>
      <div className="page-head">
        <div><h1>Complaints</h1><p>Manage and track all civic complaints.</p></div>
      </div>
      <div className="toolbar">
        <input 
          placeholder="Search complaints..." 
          value={search} 
          onChange={e=>setSearch(e.target.value)}
        />
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
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
              <th>ID</th><th>Complaint</th><th>Category</th><th>Location</th><th>Severity</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id}>
                <td>{c.id}</td>
                <td><b>{c.title}</b><small>{c.date}</small></td>
                <td>{c.category}</td>
                <td>{c.location}</td>
                <td><span className={`severity ${c.severity.toLowerCase()}`}>{c.severity}</span></td>
                <td><StatusBadge status={c.status}/></td>
                <td>
                  <button className="view-btn" onClick={()=>{setSelected(c); setPage("Complaint Details");}}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}