function MonthlyAttendance({ monthlyAttendance = [] }) {


  const formatDate = (date) => {

    if (!date) return "--";

    return new Date(date).toLocaleDateString();

  };



  const formatWorkingHours = (hours) => {

    if (hours === undefined || hours === null) {
      return "--";
    }


    const totalMinutes = Math.round(hours * 60);


    const hrs = Math.floor(totalMinutes / 60);


    const mins = totalMinutes % 60;


    return `${hrs} hrs ${mins} mins`;

  };




  const getStatusStyle = (status) => {

    switch(status) {


      case "Present":

        return {
          backgroundColor:"green",
          color:"white"
        };


      case "Late":

        return {
          backgroundColor:"orange",
          color:"white"
        };


      case "Half Day":

        return {
          backgroundColor:"gold",
          color:"black"
        };


      case "Early Checkout":

        return {
          backgroundColor:"purple",
          color:"white"
        };


      default:

        return {
          backgroundColor:"gray",
          color:"white"
        };

    }

  };





  return (

    <div className="attendance-card">


      <h2>
        Monthly Attendance
      </h2>




      <div className="table-responsive">


        <table className="table">


          <thead>

            <tr>

              <th>Date</th>

              <th>Status</th>

              <th>Working Hours</th>

            </tr>

          </thead>





          <tbody>


            {monthlyAttendance.length === 0 ? (


              <tr>

                <td colSpan="3" className="empty-state">

                  No Monthly Attendance Records

                </td>

              </tr>



            ) : (



              monthlyAttendance.map((attendance)=>(


                <tr key={attendance._id}>


                  <td>
                    {formatDate(attendance.date)}
                  </td>




                  <td>

                    <span
                      style={{
                        ...getStatusStyle(attendance.status),
                        padding:"5px 10px",
                        borderRadius:"15px",
                        fontWeight:"bold"
                      }}
                    >

                      {attendance.status}

                    </span>


                  </td>





                  <td>

                    {formatWorkingHours(attendance.workingHours)}

                  </td>




                </tr>


              ))

            )}



          </tbody>


        </table>


      </div>


    </div>

  );

}


export default MonthlyAttendance;