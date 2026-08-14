import Department from "../models/Department.js";

const createDepartment = async ({ name, description }) => {
  const existingDepartment = await Department.findOne({ name });

  if (existingDepartment) {
    throw new Error("Department already exists");
  }

  const department = await Department.create({
    name,
    description,
  });

  return department;
};

const getDepartments = async () => {
  const departments = await Department.find({
    isActive: true,
  }).sort({ name: 1 });

  return departments;
};

const getDepartmentById = async (departmentId) => {
  const department = await Department.findById(departmentId);

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

const updateDepartment = async (departmentId, updateData) => {
  const department = await Department.findByIdAndUpdate(
    departmentId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

const deleteDepartment = async (departmentId) => {
  const department = await Department.findByIdAndUpdate(
    departmentId,
    { isActive: false },
    { new: true }
  );

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};