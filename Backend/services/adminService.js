import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

export const getAllComplaints = async () => {
  return await Complaint.find()
    .populate("user", "name email")
    .populate("department", "name")
    .sort({ createdAt: -1 });
};

export const getAllUsers = async () => {
  return await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

export const updateComplaintStatus = async (
  complaintId,
  status
) => {
  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status },
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

export const assignComplaint = async (
  complaintId,
  departmentId
) => {
  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    {
      department: departmentId,
      status: "assigned",
    },
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