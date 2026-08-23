import express from "express";

import {
    register,
    login,
    adminLogin,
    departmentSignup,
    departmentLogin,
    logout,
    getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import departmentMiddleware from "../middleware/departmentMiddleware.js";

const router = express.Router();

// User

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);


// Admin

router.post(
    "/admin/login",
    adminLogin
);

router.get(
    "/admin/me",
    adminMiddleware,
    getMe
);


// Department

router.post(
    "/department/signup",
    departmentSignup
);

router.post(
    "/department/login",
    departmentLogin
);

router.get(
    "/department/me",
    departmentMiddleware,
    getMe
);


// Logout

router.post(
    "/logout",
    logout
);


// Normal user

router.get(
    "/me",
    authMiddleware,
    getMe
);

export default router;