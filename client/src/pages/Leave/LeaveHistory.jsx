import LeaveCard from "../../components/Leave/LeaveCard";

export default function LeaveHistory({
  leaves = [],
  refreshLeaves,
}) {
  const leaveList = Array.isArray(leaves) ? leaves : [];

  return (
    <div>
      <h2>Leave History</h2>

      {leaveList.length === 0 ? (
        <p>No leave records found.</p>
      ) : (
        leaveList.map((leave) => (
          <LeaveCard
            key={leave._id}
            leave={leave}
            refreshLeaves={refreshLeaves}
          />
        ))
      )}
    </div>
  );
}