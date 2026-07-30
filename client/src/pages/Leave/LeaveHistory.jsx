import React from "react";
import LeaveCard from "./LeaveCard";


const LeaveHistory = ({ leaves, refreshLeaves }) => {


  return (

    <div className="leave-history">

      <h2>
        Leave History
      </h2>


      {
        leaves.length === 0 ? (

          <p>
            No leave records found
          </p>

        ) : (

          leaves.map((leave) => (

            <LeaveCard
              key={leave._id}
              leave={leave}
              refreshLeaves={refreshLeaves}
            />

          ))

        )
      }


    </div>

  );

};


export default LeaveHistory;