import {
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getAllUsers,
} from "../services/adminService.js";

export const complaints = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getAllComplaints();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const users = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getAllUsers();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          "Status is required",
      });
    }

    const complaint =
      await updateComplaintStatus(
        req.params.id,
        status
      );

    res.status(200).json({
      success: true,
      message:
        "Complaint status updated",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const assignDepartment = async (
  req,
  res,
  next
) => {
  try {
    const {
      departmentId,
    } = req.body;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Department ID is required",
      });
    }

    const complaint =
      await assignComplaint(
        req.params.id,
        departmentId
      );

    res.status(200).json({
      success: true,
      message:
        "Complaint assigned successfully",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};