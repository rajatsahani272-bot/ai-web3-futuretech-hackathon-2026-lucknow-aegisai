import React from "react";

export default function DepartmentHeader({ user }) {

    const name = user?.name || "Department User";

    const firstLetter = name
        .charAt(0)
        .toUpperCase();

    return (
        <header className="department-header">

            <div>
                <h2>Department Panel</h2>

                <p>
                    Manage and resolve civic complaints
                </p>
            </div>

            <div className="department-user">

                <div className="department-user-avatar">
                    {firstLetter}
                </div>

                <div>
                    <strong>
                        {name}
                    </strong>

                    <span>
                        Department User
                    </span>
                </div>

            </div>

        </header>
    );
}