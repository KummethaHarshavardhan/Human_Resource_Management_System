import { useEffect, useState } from "react";
import { checkIn, checkOut } from "../../services/attendanceService";

function CheckInCard({ attendance, setTodayAttendance, loadAttendanceData }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workingSeconds, setWorkingSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load backend attendance whenever it changes
  useEffect(() => {
    if (!attendance) return;

    if (attendance.checkIn && !attendance.checkOut) {
      setIsCheckedIn(true);
      setCheckInTime(new Date(attendance.checkIn));

      const start = new Date(attendance.checkIn);

      const updateTimer = () => {
        const diff = Math.floor((Date.now() - start.getTime()) / 1000);
        setWorkingSeconds(diff);
      };

      updateTimer();

      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }

    if (attendance.checkOut) {
      setIsCheckedIn(false);
      setCheckInTime(new Date(attendance.checkIn));
      setCheckOutTime(new Date(attendance.checkOut));

      const diff = Math.floor(
        (new Date(attendance.checkOut) - new Date(attendance.checkIn)) / 1000
      );

      setWorkingSeconds(diff);
    }
  }, [attendance]);

  async function handleCheckIn() {
    try {
      setLoading(true);

      const response = await checkIn({
        remarks: "Checked in on time",
      });

      setTodayAttendance(response.data);

      await loadAttendanceData();

      alert("Check In Successful");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Check In Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut() {
    try {
      setLoading(true);

      const response = await checkOut();

      setTodayAttendance(response.data);

      await loadAttendanceData();

      alert("Check Out Successful");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Check Out Failed");
    } finally {
      setLoading(false);
    }
  }

  const hours = Math.floor(workingSeconds / 3600);
  const minutes = Math.floor((workingSeconds % 3600) / 60);
  const seconds = workingSeconds % 60;

  return (
    <div className="attendance-card">
      <h2>Attendance</h2>

      <p>
        <strong>Shift:</strong> 09:30 AM - 06:00 PM
      </p>

      <div className="attendance-buttons">
        <button
          className="btn-primary"
          onClick={handleCheckIn}
          disabled={loading || isCheckedIn}
        >
          Check In
        </button>

        <button
          className="btn-secondary"
          onClick={handleCheckOut}
          disabled={loading || !isCheckedIn}
        >
          Check Out
        </button>
      </div>

      <p>
        <strong>Status:</strong>{" "}
        {isCheckedIn ? "Checked In" : "Not Checked In"}
      </p>

      <p>
        <strong>Check In:</strong>{" "}
        {checkInTime ? checkInTime.toLocaleTimeString() : "--"}
      </p>

      <p>
        <strong>Check Out:</strong>{" "}
        {checkOutTime ? checkOutTime.toLocaleTimeString() : "--"}
      </p>

      <p>
        <strong>Working Time:</strong>{" "}
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
}

export default CheckInCard;