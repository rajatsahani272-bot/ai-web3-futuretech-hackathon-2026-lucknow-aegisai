import React, { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Complaints from "./components/Complaints";
import ComplaintDetails from "./components/ComplaintDetails";
import CityMap from "./components/CityMap";
import Profile from "./components/Profile";
import Login from "./components/Login";

import DepartmentDashboard from "./department/DepartmentDashboard";
import DepartmentComplaints from "./department/DepartmentComplaints";
import DepartmentComplaintDetails from "./department/DepartmentComplaintDetails";
import DepartmentSidebar from "./department/DepartmentSidebar";
import DepartmentHeader from "./department/DepartmentHeader";

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
        // Check admin session
        try {
          const response =
            await api.get("/auth/admin/me");

          const loggedUser =
            response.data.data;

          setUser(loggedUser);
          setIsLoggedIn(true);
          setPage("Dashboard");

          return;
        } catch (error) {
          // Admin session not found
        }

        // Check department session
        try {
          const response =
            await api.get("/auth/department/me");

          const loggedUser =
            response.data.data;

          setUser(loggedUser);
          setIsLoggedIn(true);
          setPage("Department Dashboard");

          return;
        } catch (error) {
          // Department session not found
        }

        // Check normal user session
        try {
          const response =
            await api.get("/auth/me");

          const loggedUser =
            response.data.data;

          setUser(loggedUser);
          setIsLoggedIn(true);
          setPage("Dashboard");

          return;
        } catch (error) {
          // No active session
        }

        setIsLoggedIn(false);
        setUser(null);

      } catch (error) {
        console.error(
          "Authentication error:",
          error
        );

        setIsLoggedIn(false);
        setUser(null);

      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="auth-loading">
        Checking authentication...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />
    );
  }

  const isDepartment =
    user?.role === "department";

  if (isDepartment) {
    return (
      <div className="app">

        <DepartmentSidebar
          page={page}
          setPage={setPage}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
        />

        <main className="main department-app">

          <DepartmentHeader
            user={user}
          />

          <div className="content">

            {page === "Department Dashboard" && (
              <DepartmentDashboard
                user={user}
                setPage={setPage}
                setSelected={setSelected}
              />
            )}

            {page === "Department Complaints" && (
              <DepartmentComplaints
                setPage={setPage}
                setSelected={setSelected}
              />
            )}

            {page === "Department Complaint Details" && (
              <DepartmentComplaintDetails
                complaint={selected}
                setPage={setPage}
              />
            )}

            {page === "Profile" && (
              <Profile user={user} />
            )}

          </div>

          <footer>
            © 2026 FixMyCity. All rights reserved.
            <span>
              Building Smarter Cities with AI.
            </span>
          </footer>

        </main>

      </div>
    );
  }

  const renderAdminPage = () => {
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
      return (
        <ComplaintDetails
          complaint={selected}
          setPage={setPage}
        />
      );
    }

    if (page === "City Map") {
      return <CityMap />;
    }

    if (page === "Profile") {
      return (
        <Profile user={user} />
      );
    }

    return (
      <Dashboard
        user={user}
        setPage={setPage}
        setSelected={setSelected}
        setFilter={setFilter}
      />
    );
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

        <div className="content">
          {renderAdminPage()}
        </div>

        <footer>
          © 2026 FixMyCity. All rights reserved.
          <span>
            Building Smarter Cities with AI.
          </span>
        </footer>

      </main>

    </div>
  );
}