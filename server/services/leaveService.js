import Leave from "../models/Leave.js";

// Apply Leave
export const applyLeaveService = async (leaveData) => {
    const leave = await Leave.create(leaveData);
    return leave;
};

// Get Leave History
export const getLeaveHistoryService = async (employeeId) => {
    const leaves = await Leave.find({ employee: employeeId });
    return leaves;
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