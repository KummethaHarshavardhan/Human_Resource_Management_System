import {
  approveLeave,
  rejectLeave,
} from "../../services/leaveService";

export default function LeaveApproval({
  leaves = [],
  refreshLeaves,
}) {

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString();
  };

  const handleApprove = async (id) => {
    try {
      await approveLeave(id);

      alert("Leave approved successfully.");

      if (refreshLeaves) {
        refreshLeaves();
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to approve leave."
      );
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave(id);

      alert("Leave rejected successfully.");

      if (refreshLeaves) {
        refreshLeaves();
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to reject leave."
      );
    }
  };

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  );

  return (
    <div className="leave-approval">

      <h2>Leave Requests</h2>

      {pendingLeaves.length === 0 ? (

        <p>No pending leave requests.</p>

      ) : (

        pendingLeaves.map((leave) => (

          <div
            key={leave._id}
            className="approval-card"
          >

            <h3>{leave.leaveType}</h3>

            <p>
              <strong>Employee:</strong>{" "}
              {leave.employee?.name || "--"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {leave.employee?.email || "--"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {leave.employee?.role || "--"}
            </p>

            <p>
              <strong>From:</strong>{" "}
              {formatDate(leave.startDate)}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {formatDate(leave.endDate)}
            </p>

            <p>
              <strong>Reason:</strong>{" "}
              {leave.reason}
            </p>

            <div className="approval-actions">

              <button
                type="button"
                onClick={() => handleApprove(leave._id)}
              >
                Approve
              </button>

              <button
                type="button"
                onClick={() => handleReject(leave._id)}
              >
                Reject
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}