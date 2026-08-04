function AttendanceCalendar({ calendarAttendance }) {
    const today = new Date();
    const month = today.toLocaleString("default", {
       month: "long",
    });
    const year = today.getFullYear();
    const days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];
    const totalDays = new Date(year, today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(year, today.getMonth(), 1).getDay();
    const dates = [];
    for (let i = 0; i < firstDay; i++) {
        dates.push("");
    }
    for (let i = 1; i <= totalDays; i++) {
        dates.push(i);
    }
    return (
        <div>
            <h2>Attendance Calendar</h2>
            <h3>{month} {year}</h3>
            <div  
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 60px)",
                    gap: "10px",
                    justifyContent: "center",
                    marginBottom: "10px",
                    fontWeight: "bold"
               }}
            >
               {
                    days.map((day, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign:'center'
                            }}
                        >
                            {day}
                        </div>
                    ))
                }
            </div>
           
            <div 
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 60px)",
                    gap: "10px",
                    justifyContent: "center"
                }}
            >
            {
              dates.map((date, index) => {
                 const isToday = date === today.getDate();
                 return (
                    <div
                            key={index}
                            style={{
                                width: "60px",
                                height: "40px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: isToday ? "2px solid blue" : "1px solid lightgray",
                                backgroundColor: isToday ? "#e6f0ff" : "white",
                                fontWeight: isToday ? "bold" : "normal",
                                borderRadius: "6px",
                            }}
                    >
                            {date}
                    </div>
                );
              })
            }
            </div>
        </div>
    );
}

export default AttendanceCalendar;