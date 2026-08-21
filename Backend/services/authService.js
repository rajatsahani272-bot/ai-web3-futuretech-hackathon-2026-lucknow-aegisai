import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Department from "../models/Department.js";

import generateAccessToken from "../utils/generateToken.js";


// User register

const registerUser = async ({
    name,
    email,
    password,
}) => {
    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        throw new Error(
            "User already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};


// User login

const loginUser = async ({
    email,
    password,
}) => {
    const user =
        await User.findOne({ email });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const accessToken =
        generateAccessToken(user);

    return {
        accessToken,

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};


// Admin login

const adminLoginUser = async ({
    email,
    password,
}) => {
    const user =
        await User.findOne({ email });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (user.role !== "admin") {
        throw new Error(
            "Admin access required"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new Error(
            "Invalid email or password"
        );
    }

    // Same access token for admin
    const accessToken =
        generateAccessToken(user);

    return {
        accessToken,

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};


// Department signup

const departmentSignup = async ({
    name,
    departmentCode,
    email,
    password,
    description,
}) => {
    const existingName =
        await Department.findOne({
            name,
        });

    if (existingName) {
        throw new Error(
            "Department already exists"
        );
    }

    const existingCode =
        await Department.findOne({
            departmentCode:
                departmentCode.toUpperCase(),
        });

    if (existingCode) {
        throw new Error(
            "Department code already exists"
        );
    }

    const existingEmail =
        await Department.findOne({
            email: email.toLowerCase(),
        });

    if (existingEmail) {
        throw new Error(
            "Department email already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

    const department =
        await Department.create({
            name,
            departmentCode:
                departmentCode.toUpperCase(),
            email:
                email.toLowerCase(),
            password: hashedPassword,
            description,
            isActive: true,
        });

    return {
        id: department._id,
        name: department.name,
        departmentCode:
            department.departmentCode,
        email: department.email,
        description:
            department.description,
        isActive:
            department.isActive,
    };
};


// Department login

const departmentLoginUser = async ({
    email,
    departmentCode,
    password,
}) => {
    const department =
        await Department.findOne({
            email: email.toLowerCase(),
            departmentCode:
                departmentCode.toUpperCase(),
            isActive: true,
        });

    if (!department) {
        throw new Error(
            "Invalid department credentials"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            department.password
        );

    if (!isPasswordValid) {
        throw new Error(
            "Invalid department credentials"
        );
    }

    // Same access token for department
    const accessToken =
        generateAccessToken({
            _id: department._id,
            role: "department",
        });

    return {
        accessToken,

        user: {
            id: department._id,
            name: department.name,
            email: department.email,
            departmentCode:
                department.departmentCode,
            role: "department",
            description:
                department.description,
        },
    };
};


// Get current user

const getCurrentUser = async (
    userId
) => {
    const user =
        await User.findById(userId)
            .select("-password");

    if (user) {
        return user;
    }

    const department =
        await Department.findById(
            userId
        ).select("-password");

    if (department) {
        return {
            id: department._id,
            name: department.name,
            email: department.email,
            departmentCode:
                department.departmentCode,
            role: "department",
            description:
                department.description,
            isActive:
                department.isActive,
        };
    }

    throw new Error(
        "User not found"
    );
};


// Export

export {
    registerUser,
    loginUser,
    adminLoginUser,
    departmentSignup,
    departmentLoginUser,
    getCurrentUser,
};