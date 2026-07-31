import React from "react";
import { cancelLeave } from "../../services/leaveService";


const LeaveCard = ({ leave, refreshLeaves }) => {


  const handleCancel = async () => {

    try {

      await cancelLeave(leave._id);

      alert("Leave Cancelled");

      refreshLeaves();

    } catch(error){

      alert("Unable to cancel leave");

    }

  };


  return (

    <div className="leave-card">

      <h3>
        {leave.leaveType}
      </h3>


      <p>
        Start Date: {leave.startDate}
      </p>


      <p>
        End Date: {leave.endDate}
      </p>


      <p>
        Reason: {leave.reason}
      </p>


      <p>
        Status: {leave.status}
      </p>



      {
        leave.status === "Pending" &&

        <button onClick={handleCancel}>
          Cancel Leave
        </button>
      }


    </div>

  );

};


export default LeaveCard;