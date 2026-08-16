import {
    registerUser,
    loginUser,
    adminLoginUser,
    getCurrentUser,
} from "../services/authService.js";

export const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const result = await adminLoginUser(req.body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: {
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie("accessToken");

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

export const getMe = async (req, res, next) => {
    try {
        const result = await getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};