import {
  checkInService,
  checkOutService,
  getTodayAttendanceService,
  getAttendanceHistoryService,
  getMonthlyAttendanceService,
  getAttendanceCalendarService,
} from "../services/attendanceService.js";


export const checkIn = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { location, remarks } = req.body;

    const attendance = await checkInService({
      employeeId,
      location,
      remarks,
    });

    res.status(201).json({
      success: true,
      message: "Check In successful.",
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const attendance = await checkOutService(employeeId);

    res.status(200).json({
      success: true,
      message: "Check Out successful.",
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getTodayAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const attendance = await getTodayAttendanceService(employeeId);

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const history = await getAttendanceHistoryService(employeeId);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMonthlyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { year, month } = req.params;

    const attendance = await getMonthlyAttendanceService(
      employeeId,
      year,
      month
    );

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAttendanceCalendar = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { year, month } = req.params;

    const data = await getAttendanceCalendarService(
      employeeId,
      year,
      month
    );

    res.status(200).json({
      success: true,
      employeeId,
      year,
      month,
      calendar: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};