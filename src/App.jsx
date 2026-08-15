import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Complaints from "./components/Complaints";
import ComplaintDetails from "./components/ComplaintDetails";
import CityMap from "./components/CityMap";
import Profile from "./components/Profile";
import Login from "./components/Login";
import api from "./api/axios.js";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const [page, setPage] = useState("Dashboard");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("ERROR RESPONSE:", error.response);
        console.log("ERROR REQUEST:", error.request);

        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Check authentication while API request is running
  if (checkingAuth) {
    return <div>Checking authentication...</div>;
  }

  // User is not logged in
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />;
  }

  const renderPage = () => {
    if (page === "Dashboard") {
      return (
        <Dashboard
          user={user}
          setPage={setPage}
          setSelected={setSelected}
          setFilter={setFilter}
        />
      );
    }

    if (page === "Complaints") {
      return (
        <Complaints
          setPage={setPage}
          setSelected={setSelected}
          filter={filter}
          setFilter={setFilter}
        />
      );
    }

    if (page === "Complaint Details") {
      return <ComplaintDetails complaint={selected} setPage={setPage} />;
    }

    if (page === "City Map") {
      return <CityMap />;
    }

    return <Profile user={user} />;
  };

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        setFilter={setFilter}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <main className="main">
        <Header user={user} />

        <div className="content">{renderPage()}</div>

        <footer>
          © 2025 FixMyCity. All rights reserved.
          <span>Building Smarter Cities with AI.</span>
        </footer>
      </main>
    </div>
  );
}
