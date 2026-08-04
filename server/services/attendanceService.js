import Attendance from "../models/Attendance.js";

export const checkInService = async ({ employeeId, location, remarks }) => {
  const today = new Date();

  
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);


  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  
  const attendance = await Attendance.findOne({
    employeeId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (attendance) {
    throw new Error("Employee already checked in today.");
  }

  const newAttendance = await Attendance.create({
    employeeId,
    date: today,
    checkIn: today,
    location,
    remarks,
    status: "Present",
  });

  return newAttendance;
};

export const checkOutService = async (employeeId) => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const attendance = await Attendance.findOne({
    employeeId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (!attendance) {
    throw new Error("Check In not found for today.");
  }

  if (attendance.checkOut) {
    throw new Error("Employee already checked out.");
  }

  attendance.checkOut = new Date();


  const hours =
    (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);

  attendance.workingHours = Number(hours.toFixed(2));

  
  if (attendance.workingHours < 4) {
    attendance.status = "Half Day";
  }

  await attendance.save();

  return attendance;
};

export const getTodayAttendanceService = async (employeeId) => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  return await Attendance.findOne({
    employeeId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
};


export const getAttendanceHistoryService = async (employeeId) => {
  return await Attendance.find({ employeeId }).sort({
    date: -1,
  });
};


export const getMonthlyAttendanceService = async (
  employeeId,
  year,
  month
) => {
  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 0, 23, 59, 59);

  return await Attendance.find({
    employeeId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });
};
export const getAttendanceCalendarService = async (
  employeeId,
  year,
  month
) => {

  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 0, 23, 59, 59);

  const records = await Attendance.find({
    employeeId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).select("date status");

  return records.map(record => ({
    date: record.date,
    status: record.status
  }));
};