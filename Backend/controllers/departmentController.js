import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService.js";

export const create = async (req, res, next) => {
  try {
    const department = await createDepartment(req.body);

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const departments = await getDepartments();

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const department = await getDepartmentById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const department = await updateDepartment(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteDepartment(req.params.id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};