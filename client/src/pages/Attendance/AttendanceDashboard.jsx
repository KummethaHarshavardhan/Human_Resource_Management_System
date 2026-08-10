import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

import CheckInCard from "../../components/Attendance/CheckInCard";
import TodayAttendanceCard from "../../components/Attendance/TodayAttendanceCard";
import AttendanceHistory from "../../components/Attendance/AttendanceHistory";
import MonthlyAttendance from "../../components/Attendance/MonthlyAttendance";
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";
import AdminAttendanceMonitor from "../../components/Attendance/AdminAttendanceMonitor";

import {
  getTodayAttendance,
  getAttendanceHistory,
  getMonthlyAttendance,
  getAttendanceCalendar,
  getAllAttendanceAdmin,
} from "../../services/attendanceService";
import { getLeaveHistory as getOwnLeaves } from "../../services/leaveService";

import "./AttendanceDashboard.css";

function AttendanceDashboard() {
  const { user } = useAuth();
  const role = user?.role || "";

  const isAdmin    = role === "Admin";
  const isHR       = role === "HR";
  const isEmployee = role === "Employee";

  const [currentTime, setCurrentTime] = useState(new Date());

  // Personal attendance state (Employee + HR)
  const [todayAttendance,   setTodayAttendance]   = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [calendarAttendance, setCalendarAttendance] = useState([]);
  const [approvedLeaves, setApprovedLeaves]       = useState([]);

  // Admin monitoring state
  const [adminRecords,      setAdminRecords]      = useState([]);
  const [adminLoading,      setAdminLoading]      = useState(false);
  const [adminError,        setAdminError]        = useState(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── PERSONAL attendance loader (Employee + HR) ───────────────────────────
  const loadAttendanceData = useCallback(async () => {
    try {
      const today = new Date();
      const year  = today.getFullYear();
      const month = today.getMonth() + 1;

      const [todayData, historyData, monthlyData, calendarData, ownLeaveRes] =
        await Promise.all([
          getTodayAttendance(),
          getAttendanceHistory(),
          getMonthlyAttendance(year, month),
          getAttendanceCalendar(year, month),
          getOwnLeaves().catch(() => ({ leaves: [] })),
        ]);

      setTodayAttendance(todayData?.data || null);
      setAttendanceHistory(historyData?.data || []);
      setMonthlyAttendance(monthlyData?.data || []);
      setCalendarAttendance(
        calendarData?.calendar || calendarData?.data || []
      );
      setApprovedLeaves(
        (ownLeaveRes?.leaves || []).filter((l) => l.status === "Approved")
      );
    } catch (error) {
      console.error("Failed to load personal attendance:", error);
    }
  }, []);

  // ── ADMIN monitoring loader ───────────────────────────────────────────────
  const loadAdminAttendance = useCallback(async () => {
    setAdminLoading(true);
    setAdminError(null);
    try {
      const res = await getAllAttendanceAdmin();
      setAdminRecords(res?.data || []);
    } catch (error) {
      console.error("Failed to load admin attendance:", error);
      setAdminError(
        error?.response?.data?.message || "Failed to load attendance records."
      );
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminAttendance();
    } else {
      loadAttendanceData();
    }
  }, [isAdmin, loadAdminAttendance, loadAttendanceData]);

  // ── HERO HEADER ─────────────────────────────────────────────────────────
  const heroTitle    = isAdmin ? "Attendance Monitoring" : "Attendance Dashboard";
  const heroSubtitle = isAdmin
    ? "Monitor employee and HR attendance records across the organisation."
    : "Track check-in times, work duration, monthly logs, and attendance history.";

  return (
    <div className="attendance-page">
      {/* Hero Header & Live Clock */}
      <div className="attendance-hero-card">
        <div className="attendance-hero-info">
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>

        <div className="attendance-clock-widget">
          <div className="clock-item">
            <span className="clock-label">Current Date</span>
            <span className="clock-value">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="clock-divider" />

          <div className="clock-item">
            <span className="clock-label">Live Time</span>
            <span className="clock-value">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── ADMIN VIEW ──────────────────────────────────────────────────── */}
      {isAdmin && (
        <AdminAttendanceMonitor
          records={adminRecords}
          loading={adminLoading}
          error={adminError}
          onRefresh={loadAdminAttendance}
        />
      )}

      {/* ── EMPLOYEE & HR VIEW (Check-in + personal attendance) ──────────── */}
      {(isEmployee || isHR) && (
        <div className="attendance-grid-layout">
          <div className="col-span-6">
            <div className="attendance-section-box">
              <CheckInCard
                attendance={todayAttendance}
                setTodayAttendance={setTodayAttendance}
                loadAttendanceData={loadAttendanceData}
              />
            </div>
          </div>

          <div className="col-span-6">
            <div className="attendance-section-box">
              <TodayAttendanceCard attendance={todayAttendance} />
            </div>
          </div>

          <div className="col-span-12">
            <div className="attendance-section-box">
              <AttendanceCalendar
                calendarAttendance={calendarAttendance}
                approvedLeaves={approvedLeaves}
              />
            </div>
          </div>

          <div className="col-span-12">
            <div className="attendance-section-box">
              <AttendanceHistory history={attendanceHistory} />
            </div>
          </div>

          <div className="col-span-12">
            <div className="attendance-section-box">
              <MonthlyAttendance monthlyAttendance={monthlyAttendance} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceDashboard;