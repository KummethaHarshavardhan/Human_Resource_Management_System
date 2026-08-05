import { useState } from "react";

function AttendanceCalendar({ calendarAttendance = [] }) {

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  const years = [];

  for (
    let i = currentDate.getFullYear() - 5;
    i <= currentDate.getFullYear() + 5;
    i++
  ) {
    years.push(i);
  }



  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];



  const totalDays = new Date(
    selectedYear,
    selectedMonth + 1,
    0
  ).getDate();



  const firstDay = new Date(
    selectedYear,
    selectedMonth,
    1
  ).getDay();




  const records = {};



  calendarAttendance.forEach((item)=>{

    const date = new Date(item.date);


    if(
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    ){

      records[date.getDate()] = item.status;

    }

  });




  const cells=[];


  for(let i=0;i<firstDay;i++){
    cells.push(null);
  }


  for(let i=1;i<=totalDays;i++){
    cells.push(i);
  }





  const getStatusStyle = (status)=>{


    switch(status){

      case "Present":
        return {
          background:"#4CAF50",
          color:"#fff"
        };


      case "Half Day":
        return {
          background:"#FFC107",
          color:"#000"
        };


      case "Late":
        return {
          background:"#F44336",
          color:"#fff"
        };


      case "Early Checkout":
        return {
          background:"#9C27B0",
          color:"#fff"
        };


      case "Leave":
        return {
          background:"#2196F3",
          color:"#fff"
        };


      default:
        return {
          background:"#fff",
          color:"#000"
        };

    }

  };






  return (

    <div
      style={{
        background:"#fff",
        padding:20,
        borderRadius:10,
        boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
      }}
    >


      <h2>
        Attendance Calendar
      </h2>



      <div
        style={{
          display:"flex",
          gap:10,
          marginBottom:20
        }}
      >


        <select
          value={selectedMonth}
          onChange={(e)=>
            setSelectedMonth(Number(e.target.value))
          }
        >

          {
            months.map((month,index)=>(

              <option
                key={index}
                value={index}
              >
                {month}
              </option>

            ))
          }

        </select>



        <select
          value={selectedYear}
          onChange={(e)=>
            setSelectedYear(Number(e.target.value))
          }
        >

          {
            years.map(year=>(

              <option
                key={year}
                value={year}
              >
                {year}
              </option>

            ))
          }

        </select>


      </div>






      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(7,1fr)",
          gap:8,
          textAlign:"center"
        }}
      >


        {
          days.map(day=>(

            <div
              key={day}
              style={{
                fontWeight:"bold",
                background:"#eee",
                padding:10,
                borderRadius:5
              }}
            >
              {day}
            </div>

          ))
        }





        {
          cells.map((day,index)=>{


            if(day===null)
              return <div key={index}></div>;



            const style =
              getStatusStyle(records[day]);



            return (

              <div
                key={index}
                style={{
                  border:"1px solid #ddd",
                  borderRadius:8,
                  padding:15,
                  minHeight:45,
                  fontWeight:"bold",
                  ...style
                }}
              >

                {day}

              </div>

            );

          })
        }



      </div>






      <div
        style={{
          marginTop:20,
          display:"flex",
          gap:20,
          flexWrap:"wrap"
        }}
      >


        <span style={{color:"#4CAF50",fontWeight:"bold"}}>
          ■ Present
        </span>


        <span style={{color:"#FFC107",fontWeight:"bold"}}>
          ■ Half Day
        </span>


        <span style={{color:"#F44336",fontWeight:"bold"}}>
          ■ Late
        </span>


        <span style={{color:"#9C27B0",fontWeight:"bold"}}>
          ■ Early Checkout
        </span>


        <span style={{color:"#2196F3",fontWeight:"bold"}}>
          ■ Leave
        </span>


      </div>


    </div>

  );

}


export default AttendanceCalendar;