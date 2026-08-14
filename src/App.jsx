import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Complaints from "./components/Complaints";
import ComplaintDetails from "./components/ComplaintDetails";
import CityMap from "./components/CityMap";
import Profile from "./components/Profile";

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  const renderPage = () => {
    if (page === "Dashboard") return <Dashboard setPage={setPage} setSelected={setSelected} setFilter={setFilter} />;
    if (page === "Complaints") return <Complaints setPage={setPage} setSelected={setSelected} filter={filter} setFilter={setFilter} />;
    if (page === "Complaint Details") return <ComplaintDetails complaint={selected} setPage={setPage} />;
    if (page === "City Map") return <CityMap />;
    return <Profile />;
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} setFilter={setFilter} />
      <main className="main">
        <Header />
        <div className="content">{renderPage()}</div>
        <footer>© 2025 FixMyCity. All rights reserved. <span>Building Smarter Cities with AI.</span></footer>
      </main>
    </div>
  );
}