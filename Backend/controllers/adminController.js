import {
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getAllUsers,
} from "../services/adminService.js";

export const complaints = async (req, res, next) => {
  try {
    const complaints = await getAllComplaints();

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

export const users = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const complaint = await updateComplaintStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Complaint status updated",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const assignDepartment = async (req, res, next) => {
  try {
    const complaint = await assignComplaint(
      req.params.id,
      req.body.departmentId
    );

    res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};