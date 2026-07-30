import React from "react";

import {
  approveLeave,
  rejectLeave
} from "../../services/leaveService";


const LeaveApproval = ({ leaves, refreshLeaves }) => {


  const handleApprove = async (id) => {

    try {

      await approveLeave(id);

      alert("Leave Approved");


      if (refreshLeaves) {
        refreshLeaves();
      }


    } catch (error) {

      console.error(
        "Approve Error:",
        error
      );

      alert("Failed to approve leave");

    }

  };



  const handleReject = async (id) => {

    try {

      await rejectLeave(id);

      alert("Leave Rejected");


      if (refreshLeaves) {
        refreshLeaves();
      }


    } catch (error) {

      console.error(
        "Reject Error:",
        error
      );

      alert("Failed to reject leave");

    }

  };



  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  );



  return (

    <div className="leave-approval">


      <h2>
        Leave Requests
      </h2>



      {
        pendingLeaves.length === 0 ? (

          <p>
            No pending leave requests
          </p>

        ) : (

          pendingLeaves.map((leave) => (

            <div
              className="approval-card"
              key={leave._id}
            >


              <h3>
                {leave.leaveType}
              </h3>



              <p>
                Employee: {leave.employeeName}
              </p>



              <p>
                From: {leave.startDate}
              </p>



              <p>
                To: {leave.endDate}
              </p>



              <p>
                Reason: {leave.reason}
              </p>



              <button
                onClick={() => handleApprove(leave._id)}
              >
                Approve
              </button>



              <button
                onClick={() => handleReject(leave._id)}
              >
                Reject
              </button>


            </div>

          ))

        )
      }



    </div>

  );

};


export default LeaveApproval;