import {
    registerUser,
    loginUser,
    adminLoginUser,
    departmentSignup as createDepartment,
    departmentLoginUser,
    getCurrentUser,
} from "../services/authService.js";


// User register

export const register = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await registerUser(req.body);

        res.status(201).json({
            success: true,
            message:
                "User registered successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// User login

export const login = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await loginUser(req.body);

        res.cookie(
            "accessToken",
            result.accessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge:
                    15 * 60 * 1000,
            }
        );

        res.status(200).json({
            success: true,
            message:
                "Login successful",
            data: {
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Admin login

export const adminLogin = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await adminLoginUser(req.body);

        res.cookie(
            "accessToken",
            result.accessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge:
                    15 * 60 * 1000,
            }
        );

        res.status(200).json({
            success: true,
            message:
                "Admin login successful",
            data: {
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Department signup

export const departmentSignup = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await createDepartment(
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Department account created successfully",
            data: {
                department: result,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Department login

export const departmentLogin = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await departmentLoginUser(
                req.body
            );

        res.cookie(
            "accessToken",
            result.accessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge:
                    15 * 60 * 1000,
            }
        );

        res.status(200).json({
            success: true,
            message:
                "Department login successful",
            data: {
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Logout

export const logout = (
    req,
    res
) => {
    res.clearCookie(
        "accessToken",
        {
            path: "/",
        }
    );

    res.status(200).json({
        success: true,
        message:
            "Logout successful",
    });
};


// Current user

export const getMe = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getCurrentUser(
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};