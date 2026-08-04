import React from "react";

const LeaveCalendar = ({ leaves }) => {
  return (
    <div className="leave-calendar">
      <h2>Leave Calendar</h2>

      {leaves.length === 0 ? (
        <p>No leave records found</p>
      ) : (
        leaves.map((leave) => (
          <div
            key={leave._id}
            className="calendar-card"
          >
            <p>
              <strong>Leave Type:</strong> {leave.leaveType}
            </p>

            <p>
              <strong>Start:</strong>{" "}
              {new Date(leave.startDate).toLocaleDateString()}
            </p>

            <p>
              <strong>End:</strong>{" "}
              {new Date(leave.endDate).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong> {leave.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default LeaveCalendar;