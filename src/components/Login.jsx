import React, { useState } from "react";
import api from "../api/axios";
import "./Login.css";

export default function Login({ setIsLoggedIn, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/admin/login", {
                email,
                password,
            });

            const user = response.data.data.user;

            if (user.role !== "admin") {
                setError("Admin access required.");
                return;
            }

            setUser(user);
            setIsLoggedIn(true);

        } catch (error) {
            console.error(
                "Admin login failed:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Invalid admin credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <div className="login-header">

                    <div className="login-logo">
                        Fix<span>MyCity</span>
                    </div>

                    <h1>Admin Login 🔐</h1>

                    <p>
                        Login to access the admin dashboard
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Admin Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}