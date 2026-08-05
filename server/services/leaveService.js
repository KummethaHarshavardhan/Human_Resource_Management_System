import Leave from "../models/Leave.js";

// Apply Leave
export const applyLeaveService = async (leaveData) => {
    const leave = await Leave.create(leaveData);
    return leave;
};

// Get Leave History
export const getLeaveHistoryService = async (userId, role) => {

  if (role === "Admin" || role === "HR") {
    return await Leave.find()
      .populate("employee", "name email role")
      .sort({ createdAt: -1 });
  }

  return await Leave.find({ employee: userId })
    .populate("employee", "name email role")
    .sort({ createdAt: -1 });
};

// Approve Leave
export const approveLeaveService = async (id) => {
    return await Leave.findByIdAndUpdate(
        id,
        { status: "Approved" },
        { new: true }
    );
};

// Reject Leave
export const rejectLeaveService = async (id) => {
    return await Leave.findByIdAndUpdate(
        id,
        { status: "Rejected" },
        { new: true }
    );
};

// Cancel Leave
export const cancelLeaveService = async (id) => {
    return await Leave.findByIdAndDelete(id);
};