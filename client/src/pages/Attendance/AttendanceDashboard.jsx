import { useState, useEffect } from "react";

import CheckInCard from "../../components/Attendance/CheckInCard";
import TodayAttendanceCard from "../../components/Attendance/TodayAttendanceCard";
import AttendanceHistory from "../../components/Attendance/AttendanceHistory";
import MonthlyAttendance from "../../components/Attendance/MonthlyAttendance";
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";

import {
  getTodayAttendance,
  getAttendanceHistory,
  getMonthlyAttendance,
  getAttendanceCalendar,
} from "../../services/attendanceService";

function AttendanceDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [calendarAttendance, setCalendarAttendance] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadAttendanceData();

    return () => clearInterval(timer);
  }, []);

  const loadAttendanceData = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      const todayData = await getTodayAttendance();
      console.log("Today API Response:", todayData);

      const historyData = await getAttendanceHistory();
      console.log("History API Response:", historyData);

      const monthlyData = await getMonthlyAttendance(year, month);
      console.log("Monthly API Response:", monthlyData);

      const calendarData = await getAttendanceCalendar(year, month);
      console.log("Calendar API Response:", calendarData);

     setTodayAttendance(todayData?.data || null);

     setAttendanceHistory(historyData?.data || []);

     setMonthlyAttendance(monthlyData?.data || []);

     setCalendarAttendance(
          calendarData?.calendar ||
          calendarData?.data ||
          []
    );
    } catch (error) {
      console.error("Failed to load attendance:", error);
    }
  };

  return (
    <div className="attendance-dashboard">
      <h1>Attendance Dashboard</h1>

      <p>
        <strong>Date:</strong> {currentTime.toLocaleDateString()}
      </p>

      <p>
        <strong>Time:</strong> {currentTime.toLocaleTimeString()}
      </p>

      <hr />
      <CheckInCard
        attendance={todayAttendance}
        setTodayAttendance={setTodayAttendance}
        loadAttendanceData={loadAttendanceData}
    />
      <hr />

      <TodayAttendanceCard
        attendance={todayAttendance}
      />

      <hr />

      <AttendanceCalendar
        calendarAttendance={calendarAttendance}
      />

      <hr />

      <AttendanceHistory
        history={attendanceHistory}
      />

      <hr />

      <MonthlyAttendance
        monthlyAttendance={monthlyAttendance}
      />
    </div>
  );
}

export default AttendanceDashboard;