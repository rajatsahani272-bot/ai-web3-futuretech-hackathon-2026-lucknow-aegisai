import {
  createComplaint,
  getUserComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
  updateComplaintByAdmin,
} from "../services/complaintService.js";


// Create Complaint

export const create = async (
  req,
  res,
  next
) => {
  try {
    const complaintData = {
      ...req.body,
      user: req.user.id,
      image: req.file
        ? req.file.path
        : null,
    };

    if (
      typeof complaintData.location ===
      "string"
    ) {
      complaintData.location =
        JSON.parse(
          complaintData.location
        );
    }

    const complaint =
      await createComplaint(
        complaintData
      );

    res.status(201).json({
      success: true,
      message:
        "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};


// Get My Complaints

export const getMyComplaints = async (
  req,
  res,
  next
) => {
  try {
    const complaints =
      await getUserComplaints(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};


// Get Complaint By ID

export const getById = async (
  req,
  res,
  next
) => {
  try {
    const complaint =
      await getComplaintById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};


// Update Complaint

export const update = async (
  req,
  res,
  next
) => {
  try {
    const complaint =
      await updateComplaintByAdmin(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Complaint updated successfully",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};


// Delete Complaint

export const remove = async (
  req,
  res,
  next
) => {
  try {
    await deleteComplaint(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message:
        "Complaint deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// Get All Complaints - Admin

export const getAll = async (
  req,
  res,
  next
) => {
  try {
    const complaints =
      await getAllComplaints();

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};