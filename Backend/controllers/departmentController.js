import {
  createDepartment,
} from "../services/departmentService.js";

import Department from "../models/Department.js";
import Complaint from "../models/Complaint.js";

export const signup = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      departmentCode,
      email,
      password,
      description,
    } = req.body;

    if (
      !name ||
      !departmentCode ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, department code, email and password are required",
      });
    }

    const department =
      await createDepartment({
        name,
        departmentCode,
        email,
        password,
        description,
      });

    res.status(201).json({
      success: true,
      message:
        "Department account created successfully",
      data: {
        department: {
          id: department._id,
          name: department.name,
          departmentCode:
            department.departmentCode,
          email: department.email,
          isActive:
            department.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (
  req,
  res,
  next
) => {
  try {
    const departments =
      await Department.find({})
        .select(
          "_id name departmentCode email isActive"
        )
        .sort({
          name: 1,
        });

    console.log(
      "Departments found:",
      departments
    );

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error(
      "Get departments error:",
      error
    );

    next(error);
  }
};

export const getDepartmentComplaints =
  async (
    req,
    res,
    next
  ) => {
    try {
      const complaints =
        await Complaint.find({
          department: req.user.id,
        })
          .sort({
            createdAt: -1,
          })
          .populate(
            "user",
            "name email"
          )
          .populate(
            "department",
            "name departmentCode"
          );

      res.status(200).json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      next(error);
    }
  };