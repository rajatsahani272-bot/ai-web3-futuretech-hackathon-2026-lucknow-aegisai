import ComplaintsOverview from './ComplaintsOverview'; 
import React, { useMemo, useState } from "react";



const complaintsData = [
  { id: "CMP-1024", title: "Pothole on Main Street", category: "Roads & Footpaths", location: "Hazratganj", status: "Resolved", date: "16 May 2025", severity: "High" },
  { id: "CMP-1023", title: "Garbage not collected", category: "Waste Management", location: "Gomti Nagar", status: "In Progress", date: "16 May 2025", severity: "Medium" },
  { id: "CMP-1022", title: "Water leakage in Sector 5", category: "Water Supply", location: "Indira Nagar", status: "Pending", date: "15 May 2025", severity: "High" },
  { id: "CMP-1021", title: "Broken street light", category: "Street Lighting", location: "Aliganj", status: "Resolved", date: "15 May 2025", severity: "Low" },
  { id: "CMP-1020", title: "Traffic signal not working", category: "Traffic", location: "Lucknow University", status: "In Progress", date: "14 May 2025", severity: "High" },
  { id: "CMP-1019", title: "Open drain near market", category: "Sanitation", location: "Alambagh", status: "Pending", date: "14 May 2025", severity: "Medium" }
];

// Original Navbar Items restored exactly as before
const navItems = [
  { name: "Dashboard", icon: "▦" },
  { 
    name: "Complaints", 
    icon: "⚙", 
    subItems: [
      { name: "All Complaints", page: "Complaints" },
      { name: "Complaint Details", page: "Complaint Details" }
    ]
  },
  { name: "City Map", icon: "⌖" },
  { name: "Profile", icon: "◯" },
];

function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}

function StatCard({ icon, value, label, sub, cls, onClick }) {
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

function Dashboard({ setPage, setSelected, setFilter }) {
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

function Progress({label,value,percent,cls}) {
  return (
    <div className="progress-box">
      <div><span>{label}</span><b>{value} ({percent})</b></div>
      <div className="progress-track"><div className={`progress-fill ${cls}`} style={{width:percent}}/></div>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="map">
      <div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="road r4"/>
      {["p1","p2","p3","p4","p5"].map((p,i)=><span className={`pin ${p}`} key={i}>●</span>)}
      <div className="map-label l1">Hazratganj</div><div className="map-label l2">Gomti Nagar</div><div className="map-label l3">Indira Nagar</div>
      <div className="map-center">Lucknow</div>
    </div>
  );
}

function Complaints({ setPage, setSelected, filter, setFilter }) {
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

function ComplaintDetails({complaint, setPage}) {
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

function CityMap() {
  return (
    <div>
      <div className="page-head"><div><h1>City Map</h1><p>Interactive complaint locations across Lucknow.</p></div></div>
      <div className="panel full-map">
        <MapPreview/>
        <div className="map-side">
          <h2>Map Legend</h2><p>🟢 Resolved</p><p>🔵 In Progress</p><p>🟠 Pending</p><hr/>
          <h3>Hotspots</h3><p>Hazratganj – 18 complaints</p><p>Gomti Nagar – 14 complaints</p><p>Indira Nagar – 11 complaints</p>
        </div>
      </div>
    </div>
  );
}

 function Profile() {
   return (
    <div>
     <div className="page-head"><div><h1>Profile</h1><p>Manage administrator account.</p></div></div>
      <div className="panel profile-page">
        <div className="big-avatar">AP</div>
        <h2>Anushka Pal</h2>
         <p className="role">Administrator</p>
        <div className="profile-fields">
           <label>Full Name<input value="Anushka Pal" readOnly/></label>
           <label>Email<input value="anushka.pal@fixmycity.com" readOnly/></label>
           <label>Phone<input value="+91 81715 19084" readOnly/></label>
          <label>Location<input value="Lucknow, Uttar Pradesh" readOnly/></label>
         </div>
         <button className="primary-btn">Edit Profile</button>
      </div>
    </div>
  );
 }




























export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  const renderPage = () => {
    if(page === "Dashboard") return <Dashboard setPage={setPage} setSelected={setSelected} setFilter={setFilter}/>;
    if(page === "Complaints") return <Complaints setPage={setPage} setSelected={setSelected} filter={filter} setFilter={setFilter}/>;
    if(page === "Complaint Details") return <ComplaintDetails complaint={selected} setPage={setPage}/>;
    if(page === "City Map") return <CityMap/>;
    return <Profile/>;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">⌂</div>
          <div><h2>FixMyCity</h2><p>AI-Powered Smart Civic<br/>Complaint Management</p></div>
        </div>
        <nav>
          {navItems.map((item) => (
            <div key={item.name}>
              <button 
                className={page === item.name || (item.name === "Complaints" && page === "Complaint Details") ? "active" : ""} 
                onClick={() => {
                  setPage(item.name);
                  if (item.name === "Complaints") setFilter("All");
                }}
              >
                {item.icon} {item.name}
              </button>

              {item.subItems && (
                <div style={{ paddingLeft: "25px", display: "flex", flexDirection: "column", gap: "5px" }}>
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.name}
                      style={{
                        fontSize: "13px",
                        opacity: page === sub.page ? "1" : "0.7",
                        background: page === sub.page ? "rgba(255,255,255,0.1)" : "transparent",
                        borderLeft: "2px solid #ccc",
                        borderRadius: "0 4px 4px 0",
                        paddingLeft: "8px"
                      }}
                      onClick={() => setPage(sub.page)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="side-bottom"><button>⚙ Settings</button><button>↪ Logout</button></div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="menu">☰</button>
          <div className="top-actions">
            <span className="notification">♧ <i>3</i></span>
            <div className="user-mini">
              <div className="avatar small">AP</div>
              <div><b>Anushka Pal</b><small>Administrator</small></div>
              <span>⌄</span>
            </div>
          </div>
        </header>
        <div className="content">{renderPage()}</div>
        <footer>© 2025 FixMyCity. All rights reserved. <span>Building Smarter Cities with AI.</span></footer>
      </main>
    </div>
  );
}