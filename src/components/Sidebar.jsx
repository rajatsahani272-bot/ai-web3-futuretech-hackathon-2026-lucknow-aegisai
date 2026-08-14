import React from "react";
import { navItems } from "../data/complaintsData";

export default function Sidebar({ page, setPage, setFilter }) {
  return (
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
  );
}