import Payslip from "../models/Payslip.js";

export const getPayrollTrend = async (req, res) => {
  try {
    const { year } = req.query;
    const matchStage = year ? { year: Number(year) } : {};

    const trend = await Payslip.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalGrossPay: { $sum: "$grossPay" },
          totalDeductions: { $sum: "$totalDeductions" },
          totalNetPay: { $sum: "$netPay" },
          employeeCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return res.status(200).json({
      success: true,
      count: trend.length,
      data: trend,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payroll trend",
      error: error.message,
    });
  }
};

export const getDepartmentBreakdown = async (req, res) => {
  try {
    const { month, year } = req.query;
    const matchStage = {};
    if (month) matchStage.month = Number(month);
    if (year) matchStage.year = Number(year);

    const breakdown = await Payslip.aggregate([
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
      {
        $group: {
          _id: "$employee.department",
          totalNetPay: { $sum: "$netPay" },
          employeeCount: { $sum: 1 },
        },
      },
      { $sort: { totalNetPay: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      count: breakdown.length,
      data: breakdown,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department breakdown",
      error: error.message,
    });
  }
};

export const getTopEarners = async (req, res) => {
  try {
    const { month, year, limit } = req.query;
    const matchStage = {};
    if (month) matchStage.month = Number(month);
    if (year) matchStage.year = Number(year);

    // TODO: re-add .populate("employeeId", "name email department") once Employee model is merged in
    const topEarners = await Payslip.find(matchStage)
      .sort({ netPay: -1 })
      .limit(Number(limit) || 5);

    return res.status(200).json({
      success: true,
      count: topEarners.length,
      data: topEarners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top earners",
      error: error.message,
    });
  }
};

export const getDeductionBreakdown = async (req, res) => {
  try {
    const { month, year } = req.query;
    const matchStage = {};
    if (month) matchStage.month = Number(month);
    if (year) matchStage.year = Number(year);

    const result = await Payslip.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTax: { $sum: "$deductions.tax" },
          totalProvidentFund: { $sum: "$deductions.providentFund" },
          totalInsurance: { $sum: "$deductions.insurance" },
          totalOther: { $sum: "$deductions.other" },
        },
      },
    ]);

    const breakdown = result[0] || {
      totalTax: 0,
      totalProvidentFund: 0,
      totalInsurance: 0,
      totalOther: 0,
    };
    delete breakdown._id;

    return res.status(200).json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch deduction breakdown",
      error: error.message,
    });
  }
};