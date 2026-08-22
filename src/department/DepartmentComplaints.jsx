import React, {
    useEffect,
    useState,
} from "react";

import api from "../api/axios.js";

export default function DepartmentComplaints({
    setPage,
    setSelected,
}) {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/department/complaints"
            );

            setComplaints(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Department complaints:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load complaints."
            );

        } finally {
            setLoading(false);
        }
    };

    const getLocation = (complaint) => {

        if (!complaint.location) {
            return "Location unavailable";
        }

        if (
            typeof complaint.location ===
            "string"
        ) {
            return complaint.location;
        }

        return (
            complaint.location.address ||
            complaint.location.name ||
            complaint.location.city ||
            "Location unavailable"
        );
    };

    const filteredComplaints =
        complaints.filter((complaint) => {

            const searchText = `
                ${complaint.title || ""}
                ${complaint.category || ""}
                ${getLocation(complaint)}
                ${complaint._id || ""}
            `.toLowerCase();

            const searchMatch =
                searchText.includes(
                    search.toLowerCase()
                );

            const statusMatch =
                status === "All" ||
                complaint.status === status;

            return (
                searchMatch &&
                statusMatch
            );
        });

    const openComplaint = (complaint) => {

        setSelected(complaint);

        setPage(
            "Department Complaint Details"
        );
    };

    if (loading) {
        return (
            <div className="department-loading">
                Loading complaints...
            </div>
        );
    }

    if (error) {
        return (
            <div className="department-empty">

                <div className="department-empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load complaints
                </h3>

                <p>{error}</p>

                <button
                    className="department-view-btn"
                    onClick={fetchComplaints}
                >
                    Try Again
                </button>

            </div>
        );
    }

    return (
        <div className="department-dashboard">

            <div className="department-dashboard-head">

                <div>
                    <span className="department-welcome-badge">
                        🏢 Department Panel
                    </span>

                    <h1>
                        Department Complaints
                    </h1>

                    <p>
                        Manage complaints assigned
                        to your department
                    </p>
                </div>

                <button
                    className="department-outline-btn"
                    onClick={() =>
                        setPage(
                            "Department Dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>

            </div>


            <div className="department-panel">

                <div className="department-panel-header">

                    <div>
                        <h2>
                            All Complaints
                        </h2>

                        <p>
                            {filteredComplaints.length}
                            {" "}complaints found
                        </p>
                    </div>

                </div>


                <div className="department-toolbar">

                    <div className="department-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search complaint..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="department-filter">

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option value="All">
                                All
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="assigned">
                                Assigned
                            </option>

                            <option value="in-progress">
                                In Progress
                            </option>

                            <option value="resolved">
                                Resolved
                            </option>

                        </select>

                    </div>

                </div>


                {filteredComplaints.length === 0 ? (

                    <div className="department-empty">

                        <div className="department-empty-icon">
                            📋
                        </div>

                        <h3>
                            No complaints found
                        </h3>

                        <p>
                            There are no complaints
                            matching your search.
                        </p>

                    </div>

                ) : (

                    <div className="department-table-wrapper">

                        <table className="department-table">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Complaint</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredComplaints.map(
                                    (complaint) => (

                                        <tr
                                            key={
                                                complaint._id
                                            }
                                        >

                                            <td>
                                                #
                                                {String(
                                                    complaint._id
                                                ).slice(-6)}
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        complaint.title
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    complaint.category ||
                                                    "Other"
                                                }
                                            </td>

                                            <td>
                                                <div className="department-location">
                                                    📍{" "}
                                                    {getLocation(
                                                        complaint
                                                    )}
                                                </div>
                                            </td>

                                            <td>

                                                <span
                                                    className={`department-status ${
                                                        complaint.status ||
                                                        "pending"
                                                    }`}
                                                >
                                                    {
                                                        complaint.status ||
                                                        "pending"
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {complaint.createdAt
                                                    ? new Date(
                                                        complaint.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )
                                                    : "N/A"}
                                            </td>

                                            <td>

                                                <button
                                                    className="department-view-btn"
                                                    onClick={() =>
                                                        openComplaint(
                                                            complaint
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}