import bcrypt from "bcryptjs";
import Department from "../models/Department.js";

export const createDepartment = async (
  data
) => {
  const {
    name,
    departmentCode,
    email,
    password,
    description,
  } = data;

  const code =
    departmentCode.toUpperCase();

  const departmentEmail =
    email.toLowerCase();

  const existingDepartment =
    await Department.findOne({
      $or: [
        {
          name,
        },
        {
          departmentCode: code,
        },
        {
          email: departmentEmail,
        },
      ],
    });

  if (existingDepartment) {
    if (
      existingDepartment.departmentCode ===
      code
    ) {
      throw new Error(
        "Department code already exists"
      );
    }

    if (
      existingDepartment.email ===
      departmentEmail
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
      departmentCode: code,
      email: departmentEmail,
      password: hashedPassword,
      description,
      isActive: true,
    });

  return department;
};