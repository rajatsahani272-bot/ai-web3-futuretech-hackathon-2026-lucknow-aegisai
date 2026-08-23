import React, { useState } from "react";
import api from "../api/axios";
import "./Login.css";

const departments = [
    "Road Department",
    "Sanitation Department",
    "Electricity Department",
    "Water Supply Department",
    "Drainage Department",
    "Public Safety Department",
];

export default function Login({
    setIsLoggedIn,
    setUser,
}) {
    const [loginType, setLoginType] = useState("admin");
    const [isSignup, setIsSignup] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [departmentCode, setDepartmentCode] =
        useState("");
    const [departmentName, setDepartmentName] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    /* Type */

    const handleTypeChange = (type) => {
        setLoginType(type);
        setIsSignup(false);

        setEmail("");
        setPassword("");
        setDepartmentCode("");
        setDepartmentName("");

        setError("");
        setSuccess("");
    };


    /* Department Signup */

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/department/signup",
                {
                    name: departmentName,
                    departmentCode,
                    email,
                    password,
                }
            );

            const department =
                response.data.data?.department;

            setSuccess(
                department?.departmentCode
                    ? `Department created successfully. Code: ${department.departmentCode}`
                    : "Department created successfully."
            );

            setIsSignup(false);

            setPassword("");
            setDepartmentCode("");
            setDepartmentName("");

        } catch (error) {
            console.error(
                "Department signup failed:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Department signup failed."
            );

        } finally {
            setLoading(false);
        }
    };


    /* Login */

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            let response;

            if (loginType === "admin") {

                response = await api.post(
                    "/auth/admin/login",
                    {
                        email,
                        password,
                    }
                );

            } else {

                response = await api.post(
                    "/auth/department/login",
                    {
                        email,
                        password,
                        departmentCode,
                    }
                );
            }

            const user =
                response.data.data.user;

            if (
                loginType === "admin" &&
                user.role !== "admin"
            ) {
                setError(
                    "Admin access required."
                );
                return;
            }

            if (
                loginType === "department" &&
                user.role !== "department"
            ) {
                setError(
                    "Department access required."
                );
                return;
            }

            setUser(user);
            setIsLoggedIn(true);

        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                `Invalid ${loginType} credentials`
            );

        } finally {
            setLoading(false);
        }
    };


    /* Submit */

    const handleSubmit = (e) => {
        if (isSignup) {
            handleSignup(e);
        } else {
            handleLogin(e);
        }
    };


    return (
        <div className="login-container">

            <div className="login-card">

                {/* Header */}

                <div className="login-header">

                    <div className="login-logo">
                        Fix<span>MyCity</span>
                    </div>

                    <h1>
                        {isSignup
                            ? "Department Signup 🏢"
                            : loginType === "admin"
                            ? "Admin Login 🔐"
                            : "Department Login 🏢"}
                    </h1>

                    <p>
                        {isSignup
                            ? "Create your department account"
                            : loginType === "admin"
                            ? "Login to access the admin dashboard"
                            : "Login to access your department dashboard"}
                    </p>

                </div>


                {/* Admin / Department */}

                <div className="login-switch">

                    <button
                        type="button"
                        className={
                            loginType === "admin"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleTypeChange("admin")
                        }
                    >
                        🔐 Admin
                    </button>

                    <button
                        type="button"
                        className={
                            loginType === "department"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleTypeChange(
                                "department"
                            )
                        }
                    >
                        🏢 Department
                    </button>

                </div>


                {/* Login / Signup */}

                {loginType === "department" && (
                    <div className="auth-mode-switch">

                        <button
                            type="button"
                            className={
                                !isSignup
                                    ? "active"
                                    : ""
                            }
                            onClick={() => {
                                setIsSignup(false);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className={
                                isSignup
                                    ? "active"
                                    : ""
                            }
                            onClick={() => {
                                setIsSignup(true);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            Signup
                        </button>

                    </div>
                )}


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    {/* Department Name */}

                    {isSignup && (
                        <div className="input-group">

                            <label>
                                Department Name
                            </label>

                            <select
                                value={departmentName}
                                onChange={(e) =>
                                    setDepartmentName(
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select department
                                </option>

                                {departments.map(
                                    (department) => (
                                        <option
                                            key={department}
                                            value={department}
                                        >
                                            {department}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>
                    )}


                    {/* Department Code */}

                    {loginType === "department" && (
                        <div className="input-group">

                            <label>
                                Department Code
                            </label>

                            <input
                                type="text"
                                placeholder="Enter department code"
                                value={departmentCode}
                                onChange={(e) =>
                                    setDepartmentCode(
                                        e.target.value.toUpperCase()
                                    )
                                }
                                required
                            />

                        </div>
                    )}


                    {/* Email */}

                    <div className="input-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder={
                                loginType === "admin"
                                    ? "Enter admin email"
                                    : "Enter department email"
                            }
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* Password */}

                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* Error */}

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}


                    {/* Success */}

                    {success && (
                        <p className="login-success">
                            {success}
                        </p>
                    )}


                    {/* Button */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? isSignup
                                ? "Creating Account..."
                                : "Logging in..."
                            : isSignup
                            ? "Create Department Account"
                            : loginType === "admin"
                            ? "Admin Login"
                            : "Department Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}