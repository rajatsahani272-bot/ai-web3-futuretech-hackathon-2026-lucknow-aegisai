import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

export const getAllComplaints = async () => {
  return await Complaint.find()
    .populate(
      "user",
      "name email"
    )
    .populate(
      "department",
      "name departmentCode"
    )
    .sort({
      createdAt: -1,
    });
};

export const getAllUsers = async () => {
  return await User.find()
    .select("-password")
    .sort({
      createdAt: -1,
    });
};

export const updateComplaintStatus =
  async (
    complaintId,
    status
  ) => {
    const complaint =
      await Complaint.findById(
        complaintId
      );

    if (!complaint) {
      throw new Error(
        "Complaint not found"
      );
    }

    if (
      complaint.status !== status
    ) {
      complaint.status = status;

      complaint.statusHistory.push({
        status,
        timestamp: new Date(),
      });
    }

    await complaint.save();

    await complaint.populate(
      "user",
      "name email"
    );

    await complaint.populate(
      "department",
      "name departmentCode"
    );

    return complaint;
  };

export const assignComplaint =
  async (
    complaintId,
    departmentId
  ) => {
    const complaint =
      await Complaint.findById(
        complaintId
      );

    if (!complaint) {
      throw new Error(
        "Complaint not found"
      );
    }

    const department =
      await Department.findById(
        departmentId
      );

    if (!department) {
      throw new Error(
        "Department not found"
      );
    }

    complaint.department =
      department._id;

    complaint.status =
      "assigned";

    complaint.statusHistory.push({
      status: "assigned",
      timestamp: new Date(),
    });

    await complaint.save();

    await complaint.populate(
      "user",
      "name email"
    );

    await complaint.populate(
      "department",
      "name departmentCode"
    );

    return complaint;
  };