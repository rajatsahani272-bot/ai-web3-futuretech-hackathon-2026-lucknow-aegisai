import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",

    // Admin Dashboard
    "https://ai-web3-futuretech-hackathon-2026-l.vercel.app",

    // User Frontend
    "https://ai-web3-futuretech-hack-git-1d6631-rajatsahani272-bots-projects.vercel.app",
    "https://ai-web3-futuretech-hackathon-2026-lucknow-aegisai-orsmp6pe4.vercel.app",

];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FixMyCity API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.use("/api/admin", adminRoutes);
app.use(
    "/api/department",
    departmentRoutes
);

app.use(errorMiddleware);

export default app;