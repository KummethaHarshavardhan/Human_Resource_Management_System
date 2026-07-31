import { useState, useEffect } from "react";
import CheckInCard from "../../components/Attendance/CheckInCard";
import TodayAttendanceCard from "../../components/Attendance/TodayAttendanceCard";
import AttendanceHistory from "../../components/Attendance/AttendanceHistory";
import MonthlyAttendance from "../../components/Attendance/MonthlyAttendance";
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";
import { getTodayAttendance, getAttendanceHistory, getMonthlyAttendance, getAttendanceCalendar} from "../../services/attendanceService";
function AttendanceDashboard(){
    const[currentTime, setCurrentTime]= useState(new Date());
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [monthlyAttendance, setMonthlyAttendance] = useState([]);
    const [calendarAttendance, setCalendarAttendance] = useState([]);
    useEffect(()=>{
        loadAttendanceData();
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        },1000);
        return () => clearInterval(timer);
    },[]);
    useEffect(() => {
    async function loadAttendanceData() {
        try {
            const employeeId = "EMP001";
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const todayData =
                await getTodayAttendance(employeeId);
            const historyData =
                await getAttendanceHistory(employeeId);
            const monthlyData =
                await getMonthlyAttendance(
                    employeeId,
                    year,
                    month
                );
            const calendarData =
                await getAttendanceCalendar(
                    employeeId,
                    year,
                    month
                );
            setTodayAttendance(todayData);
            setAttendanceHistory(historyData.data);
            setMonthlyAttendance(monthlyData.data);
            setCalendarAttendance(calendarData.data);
    }
    catch (error) {
            console.log(error);
        }
    }

    loadAttendanceData();
}, []);

    return (
        <div>
            <h1>Attendance Dashboard</h1>
            <p><strong>Date:</strong>{" "}
            {currentTime.toLocaleDateString()}</p>
            <p><strong>Time:</strong>{"  "}
            {currentTime.toLocaleTimeString()}</p>
            <hr />
            <CheckInCard setTodayAttendance={setTodayAttendance}/>
            <hr />
            <TodayAttendanceCard attendance={todayAttendance} />
            <hr />
            <AttendanceCalendar calendarData={calendarAttendance}/>
            <hr />
            <AttendanceHistory history={attendanceHistory}/>
            <hr />
            <MonthlyAttendance monthlyAttendance={monthlyAttendance}/>
        </div>
    )
}
export default AttendanceDashboard;