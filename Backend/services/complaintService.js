import Complaint from "../models/Complaint.js";


// Create complaint

const createComplaint = async (
  complaintData
) => {
  const complaint =
    await Complaint.create(
      complaintData
    );

  return complaint;
};


// Get user complaints

const getUserComplaints = async (
  userId
) => {
  const complaints =
    await Complaint.find({
      user: userId,
    })
      .populate(
        "department",
        "name"
      )
      .sort({
        createdAt: -1,
      });

  return complaints;
};


// Get complaint by ID

const getComplaintById = async (
  complaintId
) => {
  const complaint =
    await Complaint.findById(
      complaintId
    )
      .populate(
        "user",
        "name email"
      )
      .populate(
        "department",
        "name"
      );

  if (!complaint) {
    throw new Error(
      "Complaint not found"
    );
  }

  return complaint;
};


// Update complaint by admin

const updateComplaintByAdmin = async (
  complaintId,
  updateData
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
    updateData.status &&
    updateData.status !==
      complaint.status
  ) {
    complaint.status =
      updateData.status;

    complaint.statusHistory.push({
      status: updateData.status,
      timestamp: new Date(),
    });
  }

  if (
    updateData.note !==
    undefined
  ) {
    complaint.note =
      updateData.note;
  }

  if (
    updateData.department !==
    undefined
  ) {
    complaint.department =
      updateData.department;
  }

  if (
    updateData.priority !==
    undefined
  ) {
    complaint.priority =
      updateData.priority;
  }

  await complaint.save();

  await complaint.populate(
    "user",
    "name email"
  );

  await complaint.populate(
    "department",
    "name"
  );

  return complaint;
};


// Update complaint by user

const updateComplaint = async (
  complaintId,
  userId,
  updateData
) => {
  const complaint =
    await Complaint.findOneAndUpdate(
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
    throw new Error(
      "Complaint not found"
    );
  }

  return complaint;
};


// Delete complaint

const deleteComplaint = async (
  complaintId,
  userId
) => {
  const complaint =
    await Complaint.findOneAndDelete({
      _id: complaintId,
      user: userId,
    });

  if (!complaint) {
    throw new Error(
      "Complaint not found"
    );
  }

  return complaint;
};


// Get all complaints

const getAllComplaints = async () => {
  const complaints =
    await Complaint.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "department",
        "name"
      )
      .sort({
        createdAt: -1,
      });

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