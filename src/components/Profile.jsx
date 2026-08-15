import React from "react";

export default function Profile({ user }) {
  if (!user) {
    return (
      <div className="empty">
        <h2>User not found</h2>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p>Manage administrator account.</p>
        </div>
      </div>

      <div className="panel profile-page">

        <div className="big-avatar">
          {initials}
        </div>

        <h2>{user.name || "User"}</h2>

        <p className="role">
          {user.role || "User"}
        </p>

        <div className="profile-fields">

          <label>
            Full Name
            <input
              type="text"
              value={user.name || ""}
              readOnly
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={user.email || ""}
              readOnly
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              value={user.phone || "N/A"}
              readOnly
            />
          </label>

          <label>
            Role
            <input
              type="text"
              value={user.role || "N/A"}
              readOnly
            />
          </label>

        </div>

        <button className="primary-btn">
          Edit Profile
        </button>

      </div>
    </div>
  );
}