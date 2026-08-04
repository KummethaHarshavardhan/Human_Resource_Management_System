import React, { useEffect, useState } from "react";
import { getLeaveHistory } from "../../services/leaveService";


const LeaveCalendar = () => {

  const [leaves, setLeaves] = useState([]);



  useEffect(() => {

    fetchLeaves();

  }, []);



  const fetchLeaves = async () => {

    try {

      const data = await getLeaveHistory();

      setLeaves(data);

    } catch (error) {

      console.error(
        "Leave Calendar Error:",
        error
      );

    }

  };



  return (

    <div className="leave-calendar">

      <h1>
        Leave Calendar
      </h1>



      {
        leaves.length === 0 ? (

          <p>
            No leave records found
          </p>

        ) : (

          leaves.map((leave) => (

            <div
              className="calendar-card"
              key={leave._id}
            >

              <p>
                Leave Type: {leave.leaveType}
              </p>


              <p>
                Date: {leave.startDate} - {leave.endDate}
              </p>


              <p>
                Status: {leave.status}
              </p>


            </div>

          ))

        )
      }


    </div>

  );

};


export default LeaveCalendar;
