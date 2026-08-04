import React, { useEffect, useState } from "react";

import ApplyLeaveForm from "./ApplyLeave";
import LeaveHistory from "./LeaveHistory";

import { getLeaveHistory } from "../../services/leaveService";


const LeaveDashboard = () => {


  const [leaves, setLeaves] = useState([]);



  const fetchLeaves = async () => {

    try {

      const data = await getLeaveHistory();

      setLeaves(data);

    } catch (error) {

      console.error(
        "Failed to fetch leaves",
        error
      );

    }

  };



  useEffect(() => {

    fetchLeaves();

  }, []);



  return (

    <div className="leave-dashboard">


      <h1>
        Leave Management
      </h1>


      <ApplyLeaveForm
        refreshLeaves={fetchLeaves}
      />


      <LeaveHistory
        leaves={leaves}
        refreshLeaves={fetchLeaves}
      />


    </div>

  );

};


export default LeaveDashboard;