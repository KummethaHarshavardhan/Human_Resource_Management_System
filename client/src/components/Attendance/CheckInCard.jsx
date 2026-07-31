import { useState } from "react";
import { checkIn, checkOut } from "../../services/attendanceService";
import {EMPLOYEE_ID, OFFICE_LOCATION, CHECK_IN_REMARK} from "../../utils/attendanceConstants";
function CheckInCard({ setTodayAttendance }) {
    const[isCheckedIn, setIsCheckedIn]= useState(false);
    const [checkInTime, setCheckInTime]= useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [workingSeconds, setWorkingSeconds]= useState(0);
    const [timer, setTimer]= useState(null);
    async function handleCheckIn(){
        try{
            const attendance = await checkIn( {
            employeeId: EMPLOYEE_ID,
            location: OFFICE_LOCATION,
            remarks: CHECK_IN_REMARK
            });
            console.log(attendance);
            alert("Check In Successful!");
            setTodayAttendance(attendance);
            setIsCheckedIn(attendance.status ==="Present");
            setCheckInTime(new Date(attendance.checkIn));
            const interval= setInterval(()=>{
               setWorkingSeconds((previousSeconds) => previousSeconds + 1);
            },1000);
            setTimer(interval);
        }
        catch(error){
            console.log(error);
            alert("Check in Failed!");
        }
    }
    async function handleCheckOut(){
       try{
           const attendance = await checkOut(EMPLOYEE_ID);
           alert("Check Out Successful!");
           setCheckOutTime(new Date(attendance.checkOut));
           setTodayAttendance(attendance);
           setIsCheckedIn(false);
           clearInterval(timer);
        }
        catch(error){
            console.log(error);
            alert("Check Out Failed!");
        }
    }
    const hours = Math.floor(workingSeconds / 3600);
    const minutes = Math.floor((workingSeconds % 3600) / 60);
    const seconds = workingSeconds % 60;
    return (
        <div>

            <h2>Attendance</h2>
            <p><strong>General Shift:</strong>09:30 AM - 06:00 PM</p>
            <button onClick={handleCheckIn} disabled={isCheckedIn}>Check In</button>
            <button onClick={handleCheckOut} disabled={!isCheckedIn}>Check Out</button>
            <p> <strong>Status :</strong>{" "}
            {isCheckedIn ? "Checked In" : "Not Checked In"}
            </p>
            <p><strong>Check In Time :</strong>{" "}
                {
                    checkInTime? checkInTime.toLocaleTimeString() : " _ _ "
                }
            </p>
            <p> <strong>Check Out Time :</strong>{" "}
                {
                    checkOutTime ? checkOutTime.toLocaleTimeString() : "_ _"
                }
            </p>
            <p>Working Hours : 
                  {String(hours).padStart(2, "0")} : 
                  {String(minutes).padStart(2, "0")} :
                  {String(seconds).padStart(2, "0")}
            </p>

        </div>
    );
}

export default CheckInCard;