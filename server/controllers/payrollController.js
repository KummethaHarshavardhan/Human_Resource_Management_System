import Payroll from "../models/Payroll.js";
import Salary from "../models/Salary.js";
import { calculatePayroll } from "../services/payrollService.js";

export const generatePayroll = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      daysPresent,
      totalWorkingDays,
      bonus = 0,
    } = req.body;

    const existingPayroll = await Payroll.findOne({
      employeeId,
      month,
      year,
    });

    if (existingPayroll) {
      return res.status(409).json({
        success: false,
        message: `Payroll already generated for this employee for ${month}/${year}`,
      });
    }

    const activeSalary = await Salary.findOne({
      employeeId,
      isActive: true,
    });

    if (!activeSalary) {
      return res.status(404).json({
        success: false,
        message:
          "No active salary structure found for this employee.",
      });
    }

    const calculated = calculatePayroll({
      basicSalary: activeSalary.basicSalary,
      hra: activeSalary.hra,
      allowances: activeSalary.allowances,
      deductions: activeSalary.deductions,
      bonus,
      daysPresent,
      totalWorkingDays,
    });

    const payroll = await Payroll.create({
      employeeId,
      salaryId: activeSalary._id,
      month,
      year,
      daysPresent,
      totalWorkingDays,
      basicSalary: activeSalary.basicSalary,
      hra: activeSalary.hra,
      allowances: activeSalary.allowances,
      deductions: activeSalary.deductions,
      bonus,
      grossSalary: calculated.grossSalary,
      netSalary: calculated.netSalary,
      status: "Generated",
      generatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("Generate Payroll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPayrolls = async (req, res) => {
  try {
    // Employee module not ready, so don't populate
    const payrolls = await Payroll.find().sort({
      year: -1,
      month: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    console.error("getAllPayrolls Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong fetching payroll records",
      error: error.message,
    });
  }
};

export const getPayrollsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const payrolls = await Payroll.find({
      employeeId,
    }).sort({
      year: -1,
      month: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    console.error("getPayrollsByEmployee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong fetching payroll records",
      error: error.message,
    });
  }
};

export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    console.error("getPayrollById Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong fetching payroll record",
      error: error.message,
    });
  }
};

export const markPayrollAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    if (payroll.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payroll is already marked as paid",
      });
    }

    payroll.status = "Paid";
    payroll.paymentDate = new Date();

    await payroll.save();

    return res.status(200).json({
      success: true,
      message: "Payroll marked as paid successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("markPayrollAsPaid Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong updating payroll status",
      error: error.message,
    });
  }
};