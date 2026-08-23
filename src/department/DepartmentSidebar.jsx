import React from "react";
import "./DepartmentDashboard.css";

export default function DepartmentSidebar({
    page,
    setPage,
    setIsLoggedIn,
    setUser,
}) {
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        }

        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <aside className="department-sidebar">

            <div className="department-logo">
                Fix<span>MyCity</span>
            </div>

            <nav className="department-menu">

                <button
                    className={`department-menu-item ${
                        page === "Department Dashboard"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setPage("Department Dashboard")
                    }
                >
                    <span>📊</span>
                    <span>Dashboard</span>
                </button>

                <button
                    className={`department-menu-item ${
                        page === "Department Complaints"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setPage("Department Complaints")
                    }
                >
                    <span>📋</span>
                    <span>Complaints</span>
                </button>

                <button
                    className={`department-menu-item ${
                        page === "Profile"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setPage("Profile")
                    }
                >
                    <span>👤</span>
                    <span>Profile</span>
                </button>

            </nav>

            <div className="department-sidebar-bottom">

                <button
                    className="department-logout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}