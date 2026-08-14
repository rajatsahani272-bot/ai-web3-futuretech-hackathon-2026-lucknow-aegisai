import React from "react";
import ComplaintsOverview from "../ComplaintsOverview";
import { complaintsData } from "../data/complaintsData";
import StatusBadge from "./StatusBadge";
import StatCard from "./StatCard";
import MapPreview from "./MapPreview";

function Progress({label, value, percent, cls}) {
  return (
    <div className="progress-box">
      <div><span>{label}</span><b>{value} ({percent})</b></div>
      <div className="progress-track"><div className={`progress-fill ${cls}`} style={{width:percent}}/></div>
    </div>
  );
}

export default function Dashboard({ setPage, setSelected, setFilter }) {
  const recent = complaintsData.slice(0, 5);

  const handleCardClick = (statusFilter) => {
    setFilter(statusFilter);
    setPage("Complaints");
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Anushka Pal!</p>
        </div>
        <select className="date-select">
          <option>May 9 – May 16, 2025</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className="stats-grid">
        <StatCard icon="▦" value="128" label="Total Complaints" sub="↑ 12 this week" cls="blue" onClick={() => handleCardClick("All")} />
        <StatCard icon="✓" value="74" label="Resolved" sub="57.8% of total" cls="green" onClick={() => handleCardClick("Resolved")} />
        <StatCard icon="◷" value="32" label="In Progress" sub="25.0% of total" cls="purple" onClick={() => handleCardClick("In Progress")} />
        <StatCard icon="!" value="22" label="Pending" sub="17.2% of total" cls="orange" onClick={() => handleCardClick("Pending")} />
        <StatCard icon="♙" value="532" label="Citizens" sub="+28 this week" cls="teal" onClick={() => setPage("Profile")} />
      </div> 

      <div className="dashboard-grid">
        <ComplaintsOverview/>
        <section className="panel">
          <div className="panel-title"><h2>Complaints by Category</h2></div>
          <div className="donut-wrap">
            <div className="donut" style={{cursor:'pointer'}} onClick={() => handleCardClick("All")}>
              <strong>128</strong><small>Total</small>
            </div>
            <div className="category-list">
              {[
                ["Roads & Footpaths","38%","c1"],["Waste Management","22%","c2"],
                ["Water Supply","18%","c3"],["Street Lighting","12%","c4"],["Other","10%","c5"]
              ].map(([n,v,c])=> (
                <div className="category-row" key={n} style={{cursor:'pointer'}} onClick={() => handleCardClick("All")}>
                  <i className={`dot ${c}`}/><span>{n}</span><b>{v}</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>Recent Complaints</h2>
            <button onClick={() => { setFilter("All"); setPage("Complaints"); }}>View All</button>
          </div>
          <div className="recent-list">
            {recent.map(c => (
              <button className="recent-item" key={c.id} onClick={() => { setSelected(c); setPage("Complaint Details"); }}>
                <span className="thumb">▣</span>
                <span className="recent-text"><b>{c.title}</b><small>{c.category}</small></span>
                <StatusBadge status={c.status}/>
              </button>
            ))}
          </div>
        </section>

        <section className="panel large">
          <div className="panel-title"><h2>City Map</h2><button onClick={() => setPage("City Map")}>View Full Map</button></div>
          <MapPreview />
        </section>

        <section className="panel">
          <div className="panel-title"><h2>Complaints Status</h2></div>
          <div style={{cursor:'pointer'}} onClick={() => handleCardClick("Resolved")}>
            <Progress label="Resolved" value="74" percent="57.8%" cls="green-bar"/>
          </div>
          <div style={{cursor:'pointer'}} onClick={() => handleCardClick("In Progress")}>
            <Progress label="In Progress" value="32" percent="25.0%" cls="blue-bar"/>
          </div>
          <div style={{cursor:'pointer'}} onClick={() => handleCardClick("Pending")}>
            <Progress label="Pending" value="22" percent="17.2%" cls="orange-bar"/>
          </div>
        </section>

        <section className="panel profile-mini">
          <div className="panel-title"><h2>My Profile</h2></div>
          <div className="profile-row"><div className="avatar">AP</div><div><h3>Anushka Pal</h3><p>Administrator</p></div></div>
          <p>✉ anushka.pal@fixmycity.com</p><p>⌖ Lucknow, Uttar Pradesh</p>
          <button className="full-btn" onClick={() => setPage("Profile")}>Edit Profile</button>
        </section>
      </div>
    </>
  );
}