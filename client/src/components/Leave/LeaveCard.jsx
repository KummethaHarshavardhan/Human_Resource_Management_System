import { cancelLeave } from "../../services/leaveService";

export default function LeaveCard({
  leave,
  refreshLeaves,
}) {

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString();
  };

  const handleCancel = async () => {
    try {
      await cancelLeave(leave._id);

      alert("Leave cancelled successfully.");

      if (refreshLeaves) {
        refreshLeaves();
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to cancel leave."
      );
    }
  };

  return (

    <div className="leave-card">

      <h3>{leave.leaveType}</h3>

      <p>
        <strong>Start Date:</strong>{" "}
        {formatDate(leave.startDate)}
      </p>

      <p>
        <strong>End Date:</strong>{" "}
        {formatDate(leave.endDate)}
      </p>

      <p>
        <strong>Reason:</strong>{" "}
        {leave.reason}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`status ${leave.status?.toLowerCase()}`}
        >
          {leave.status}
        </span>
      </p>

      {leave.status === "Pending" && (
        <button
          type="button"
          onClick={handleCancel}
        >
          Cancel Leave
        </button>
      )}

    </div>

  );
}