import React from "react";

export default function Header() {
  return (
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
  );
}