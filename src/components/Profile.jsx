import React from "react";

export default function Profile() {
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