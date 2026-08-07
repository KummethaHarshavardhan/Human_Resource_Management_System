import mongoose from "mongoose";
import Payslip from "../models/Payslip.js";
import Report from "../models/Report.js";

export const generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "month and year are required",
      });
    }

    const payslips = await Payslip.find({ month: Number(month), year: Number(year) });

    const summary = payslips.reduce(
      (acc, p) => {
        acc.totalEmployees += 1;
        acc.totalGrossPay += p.grossPay;
        acc.totalDeductions += p.totalDeductions;
        acc.totalNetPay += p.netPay;
        return acc;
      },
      { totalEmployees: 0, totalGrossPay: 0, totalDeductions: 0, totalNetPay: 0 }
    );

    const report = await Report.create({
      reportType: "monthly",
      month: Number(month),
      year: Number(year),
      summary,
      filters: { month, year },
      generatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Monthly report generated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate monthly report",
      error: error.message,
    });
  }
};

export const generateYearlyReport = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "year is required",
      });
    }

    const payslips = await Payslip.find({ year: Number(year) });

    const summary = payslips.reduce(
      (acc, p) => {
        acc.totalEmployees += 1;
        acc.totalGrossPay += p.grossPay;
        acc.totalDeductions += p.totalDeductions;
        acc.totalNetPay += p.netPay;
        return acc;
      },
      { totalEmployees: 0, totalGrossPay: 0, totalDeductions: 0, totalNetPay: 0 }
    );

    const report = await Report.create({
      reportType: "yearly",
      year: Number(year),
      summary,
      filters: { year },
      generatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Yearly report generated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate yearly report",
      error: error.message,
    });
  }
};

export const generateEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "employeeId is required",
      });
    }

    const payslips = await Payslip.find({ employeeId }).sort({ year: -1, month: -1 });

    if (payslips.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payslips found for this employee",
      });
    }

    const summary = payslips.reduce(
      (acc, p) => {
        acc.totalEmployees = 1;
        acc.totalGrossPay += p.grossPay;
        acc.totalDeductions += p.totalDeductions;
        acc.totalNetPay += p.netPay;
        return acc;
      },
      { totalEmployees: 0, totalGrossPay: 0, totalDeductions: 0, totalNetPay: 0 }
    );

    const report = await Report.create({
      reportType: "employee",
      employeeId,
      summary,
      filters: { employeeId },
      generatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Employee report generated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate employee report",
      error: error.message,
    });
  }
};

export const generateDepartmentReport = async (req, res) => {
  try {
    const { department, month, year } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "department is required",
      });
    }

    const matchStage = {};
    if (month) matchStage.month = Number(month);
    if (year) matchStage.year = Number(year);

    const result = await Payslip.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      { $match: { "employee.department": department } },
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalGrossPay: { $sum: "$grossPay" },
          totalDeductions: { $sum: "$totalDeductions" },
          totalNetPay: { $sum: "$netPay" },
        },
      },
    ]);

    const summary = result[0] || {
      totalEmployees: 0,
      totalGrossPay: 0,
      totalDeductions: 0,
      totalNetPay: 0,
    };
    delete summary._id;

    const report = await Report.create({
      reportType: "department",
      department,
      month: month ? Number(month) : null,
      year: year ? Number(year) : null,
      summary,
      filters: { department, month, year },
      generatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Department report generated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate department report",
      error: error.message,
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { reportType } = req.query;

    const query = {};
    if (reportType) query.reportType = reportType;

    const reports = await Report.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

export const exportReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const rows = [
      ["Field", "Value"],
      ["Report Type", report.reportType],
      ["Month", report.month ?? "-"],
      ["Year", report.year ?? "-"],
      ["Department", report.department ?? "-"],
      ["Employee ID", report.employeeId ?? "-"],
      ["Total Employees", report.summary.totalEmployees],
      ["Total Gross Pay", report.summary.totalGrossPay],
      ["Total Deductions", report.summary.totalDeductions],
      ["Total Net Pay", report.summary.totalNetPay],
      ["Generated At", report.generatedAt.toISOString()],
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const fileName = `report-${report.reportType}-${id}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export report",
      error: error.message,
    });
  }
};