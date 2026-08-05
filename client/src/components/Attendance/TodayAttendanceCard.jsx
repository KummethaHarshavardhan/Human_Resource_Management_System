function TodayAttendanceCard({ attendance }) {


  const formatDateTime = (date) => {

    if (!date) return "--";

    return new Date(date).toLocaleString();

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
          backgroundColor: "green",
          color: "white",
        };



      case "Late":

        return {
          backgroundColor: "orange",
          color: "white",
        };



      case "Half Day":

        return {
          backgroundColor: "gold",
          color: "black",
        };



      case "Early Checkout":

        return {
          backgroundColor: "purple",
          color: "white",
        };



      default:

        return {
          backgroundColor: "gray",
          color: "white",
        };

    }

  };







  return (

    <div
      className="attendance-card"
      style={{
        background:"#fff",
        padding:"20px",
        borderRadius:"10px",
        boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
      }}
    >


      <h2>
        Today's Attendance
      </h2>





      <div className="attendance-details">



        <div className="attendance-item">

          <strong>Status</strong>


          <span

            style={{
              ...getStatusStyle(attendance?.status),

              padding:"6px 12px",

              borderRadius:"15px",

              fontWeight:"bold",

              display:"inline-block",

              marginLeft:"10px"
            }}

          >

            {attendance?.status || "--"}

          </span>


        </div>







        <div className="attendance-item">

          <strong>Check In</strong>

          <span>
            {formatDateTime(attendance?.checkIn)}
          </span>

        </div>







        <div className="attendance-item">

          <strong>Check Out</strong>

          <span>
            {formatDateTime(attendance?.checkOut)}
          </span>

        </div>








        <div className="attendance-item">

          <strong>Working Hours</strong>


          <span>
            {formatWorkingHours(attendance?.workingHours)}
          </span>


        </div>








        <div className="attendance-item">

          <strong>Remarks</strong>


          <span>
            {attendance?.remarks || "--"}
          </span>


        </div>





      </div>



    </div>

  );

}


export default TodayAttendanceCard;