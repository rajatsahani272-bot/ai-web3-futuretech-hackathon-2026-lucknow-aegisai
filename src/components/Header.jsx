import React from "react";

export default function Header({ user }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="topbar">
      <button className="menu">☰</button>

      <div className="top-actions">
        <span className="notification">
          ♧ <i>3</i>
        </span>

        <div className="user-mini">
          <div className="avatar small">
            {initials}
          </div>

          <div>
            <b>{user?.name || "User"}</b>
            <small>{user?.role || "User"}</small>
          </div>

          <span>⌄</span>
        </div>
      </div>
    </header>
  );
}