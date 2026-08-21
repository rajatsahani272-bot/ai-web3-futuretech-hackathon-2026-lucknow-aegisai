import bcrypt from "bcryptjs";
import Department from "../models/Department.js";

export const createDepartment = async (data) => {
  const {
    name,
    departmentCode,
    email,
    password,
    description,
  } = data;

  const normalizedCode =
    departmentCode.toUpperCase();

  const normalizedEmail =
    email.toLowerCase();

  const existingDepartment =
    await Department.findOne({
      $or: [
        { name },
        {
          departmentCode:
            normalizedCode,
        },
        {
          email:
            normalizedEmail,
        },
      ],
    });

  if (existingDepartment) {
    if (
      existingDepartment.departmentCode ===
      normalizedCode
    ) {
      throw new Error(
        "Department code already exists"
      );
    }

    if (
      existingDepartment.email ===
      normalizedEmail
    ) {
      throw new Error(
        "Department email already exists"
      );
    }

    if (
      existingDepartment.name.toLowerCase() ===
      name.toLowerCase()
    ) {
      throw new Error(
        "Department already exists"
      );
    }
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
        normalizedCode,
      email:
        normalizedEmail,
      password:
        hashedPassword,
      description,
      isActive: true,
    });

  return department;
};