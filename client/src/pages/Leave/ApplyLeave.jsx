import { useState } from "react";
import { applyLeave } from "../../services/leaveService";

export default function ApplyLeave({ refreshLeaves }) {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await applyLeave(formData);

      alert("Leave applied successfully.");

      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      if (refreshLeaves) {
        refreshLeaves();
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to apply leave."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-form">

      <h2>Apply Leave</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Leave Type</label>

          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
            <option value="Emergency">Emergency Leave</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date</label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason</label>

          <textarea
            name="reason"
            placeholder="Enter reason"
            rows={4}
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Applying..." : "Apply Leave"}
        </button>

      </form>
    </div>
  );
}