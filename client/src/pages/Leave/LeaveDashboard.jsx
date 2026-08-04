import { useEffect, useState } from "react";

import ApplyLeave from "./ApplyLeave";
import LeaveHistory from "./LeaveHistory";
import LeaveApproval from "./LeaveApproval";
import LeaveCalendar from "./LeaveCalendar";

import { getLeaveHistory } from "../../services/leaveService";

export default function LeaveDashboard() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const response = await getLeaveHistory();

      console.log("Leave API Response:", response);

      setLeaves(response.leaves || []);
    } catch (error) {
      console.error("Failed to fetch leave history:", error);
      setLeaves([]);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="leave-dashboard">
      <h1>Leave Management</h1>

      <ApplyLeave refreshLeaves={fetchLeaves} />

      <LeaveHistory
        leaves={leaves}
        refreshLeaves={fetchLeaves}
      />

      <LeaveApproval
        leaves={leaves}
        refreshLeaves={fetchLeaves}
      />

      <LeaveCalendar leaves={leaves} />
    </div>
  );
}