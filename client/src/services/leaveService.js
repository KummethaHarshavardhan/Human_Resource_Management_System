import axios from "axios";

const API_URL = "http://localhost:5000/api/leave";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};


// Apply Leave
export const applyLeave = async (leaveData) => {
  try {
    const response = await axios.post(
      `${API_URL}/apply`,
      leaveData,
      getAuthHeader()
    );

    return response.data;

  } catch (error) {
    console.error("Apply Leave Error:", error);
    throw error;
  }
};


// Get Leave History
export const getLeaveHistory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/history`,
      getAuthHeader()
    );

    return response.data;

  } catch (error) {
    console.error("Leave History Error:", error);
    throw error;
  }
};


// Approve Leave
export const approveLeave = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/approve/${id}`,
      {},
      getAuthHeader()
    );

    return response.data;

  } catch (error) {
    console.error("Approve Leave Error:", error);
    throw error;
  }
};


// Reject Leave
export const rejectLeave = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/reject/${id}`,
      {},
      getAuthHeader()
    );

    return response.data;

  } catch (error) {
    console.error("Reject Leave Error:", error);
    throw error;
  }
};


// Cancel Leave
export const cancelLeave = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeader()
    );

    return response.data;

  } catch (error) {
    console.error("Cancel Leave Error:", error);
    throw error;
  }
};