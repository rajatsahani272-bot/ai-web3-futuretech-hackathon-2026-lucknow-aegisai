import Complaint from "../models/Complaint.js";

const createComplaint = async (complaintData) => {
  const complaint = await Complaint.create(complaintData);

  return complaint;
};

const getUserComplaints = async (userId) => {
  const complaints = await Complaint.find({ user: userId })
    .populate("department", "name")
    .sort({ createdAt: -1 });

  return complaints;
};

const getComplaintById = async (complaintId) => {
  const complaint = await Complaint.findById(complaintId)
    .populate("user", "name email")
    .populate("department", "name");

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  return complaint;
};
const updateComplaintByAdmin = async (complaintId, updateData) => {
  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("user", "name email")
    .populate("department", "name");

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  return complaint;
};

const updateComplaint = async (complaintId, userId, updateData) => {
  const complaint = await Complaint.findOneAndUpdate(
    {
      _id: complaintId,
      user: userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  return complaint;
};

const deleteComplaint = async (complaintId, userId) => {
  const complaint = await Complaint.findOneAndDelete({
    _id: complaintId,
    user: userId,
  });

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  return complaint;
};

const getAllComplaints = async () => {
  const complaints = await Complaint.find()
    .populate("user", "name email")
    .populate("department", "name")
    .sort({ createdAt: -1 });

  return complaints;
};

export {
  createComplaint,
  getUserComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintByAdmin,
  deleteComplaint,
  getAllComplaints,
};