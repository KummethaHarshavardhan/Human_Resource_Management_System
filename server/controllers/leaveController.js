import {
  applyLeaveService,
  getLeaveHistoryService,
  approveLeaveService,
  rejectLeaveService,
  cancelLeaveService,
} from "../services/leaveService.js";

// Apply Leave
export const applyLeave = async (req, res) => {
  try {
    const leave = await applyLeaveService({
      ...req.body,
      employee: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Leave History
export const getLeaveHistory = async (req, res) => {
  try {
    const leaves = await getLeaveHistoryService(
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Approve Leave
export const approveLeave = async (req, res) => {
  try {
    const leave = await approveLeaveService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Leave approved",
      leave,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Reject Leave
export const rejectLeave = async (req, res) => {
  try {
    const leave = await rejectLeaveService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Leave rejected",
      leave,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Cancel Leave
export const cancelLeave = async (req, res) => {
  try {
    await cancelLeaveService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};