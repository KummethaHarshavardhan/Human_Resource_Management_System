import Employee from "../models/Employee.js";

// =====================================================
// 1. CREATE EMPLOYEE
// Admin / HR can create an employee
// =====================================================
export const createEmployee = async (req, res) => {
  try {
    const {
      user_id,
      department_id,
      designation,
      manager_id,
      date_of_joining,
      employment_status,
    } = req.body;

    // Required field validation
    if (!user_id || !department_id || !designation || !date_of_joining) {
      return res.status(400).json({
        success: false,
        message:
          "user_id, department_id, designation and date_of_joining are required",
      });
    }

    // Check if user is already linked to an employee
    const existingEmployee = await Employee.findOne({ user_id });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "This user is already registered as an employee",
      });
    }

    // Generate Employee Code
    const lastEmployee = await Employee.findOne()
      .sort({ createdAt: -1 })
      .select("employee_code");

    let employeeNumber = 1;

    if (lastEmployee && lastEmployee.employee_code) {
      const lastNumber = parseInt(
        lastEmployee.employee_code.replace("EMP", ""),
        10
      );

      if (!isNaN(lastNumber)) {
        employeeNumber = lastNumber + 1;
      }
    }

    const employee_code = `EMP${String(employeeNumber).padStart(3, "0")}`;

    // Create employee
    const employee = await Employee.create({
      user_id,
      employee_code,
      department_id,
      designation,
      manager_id: manager_id || null,
      date_of_joining,
      employment_status: employment_status || "Active",
    });

    // Return populated employee data
    const populatedEmployee = await Employee.findById(employee._id)
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation");

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: populatedEmployee,
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating employee",
      error: error.message,
    });
  }
};

// =====================================================
// 2. GET ALL EMPLOYEES
// Search + Pagination + Status Filter
// =====================================================
export const getAllEmployees = async (req, res) => {
  try {
    const {
      search = "",
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter
    const filter = {};

    if (status) {
      filter.employment_status = status;
    }

    // Search employee code or designation
    if (search) {
      filter.$or = [
        { employee_code: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const totalEmployees = await Employee.countDocuments(filter);

    const employees = await Employee.find(filter)
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      totalEmployees,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalEmployees / limitNumber),
      employees,
    });
  } catch (error) {
    console.error("GET ALL EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};

// =====================================================
// 3. GET SINGLE EMPLOYEE
// =====================================================
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (error) {
    console.error("GET EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: error.message,
    });
  }
};

// =====================================================
// 4. UPDATE EMPLOYEE
// Admin / HR can update employee details
// =====================================================
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_id,
      department_id,
      designation,
      manager_id,
      date_of_joining,
      employment_status,
    } = req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Update only provided fields
    if (user_id !== undefined) employee.user_id = user_id;
    if (department_id !== undefined)
      employee.department_id = department_id;
    if (designation !== undefined)
      employee.designation = designation;
    if (manager_id !== undefined)
      employee.manager_id = manager_id || null;
    if (date_of_joining !== undefined)
      employee.date_of_joining = date_of_joining;
    if (employment_status !== undefined)
      employee.employment_status = employment_status;

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation");

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating employee",
      error: error.message,
    });
  }
};

// =====================================================
// 5. DELETE EMPLOYEE
// =====================================================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await Employee.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: error.message,
    });
  }
};

// =====================================================
// 6. UPDATE EMPLOYEE STATUS
// Active / Inactive
// =====================================================
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { employment_status } = req.body;

    if (!["Active", "Inactive"].includes(employment_status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Inactive",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { employment_status },
      { returnDocument:"after", runValidators: true }
    )
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee status updated successfully",
      employee,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating employee status",
      error: error.message,
    });
  }
};

// =====================================================
// 7. GET LOGGED-IN EMPLOYEE PROFILE
// Uses Team 1 JWT: req.user.id
// =====================================================
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const employee = await Employee.findOne({ user_id: userId })
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      employee,
    });
  } catch (error) {
    console.error("GET MY PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// =====================================================
// 8. UPDATE LOGGED-IN EMPLOYEE PROFILE
// Employee can update allowed profile fields
// =====================================================
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      designation,
      manager_id,
      date_of_joining,
    } = req.body;

    const employee = await Employee.findOne({ user_id: userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    // Employee can update only allowed fields
    if (designation !== undefined) {
      employee.designation = designation;
    }

    if (manager_id !== undefined) {
      employee.manager_id = manager_id || null;
    }

    if (date_of_joining !== undefined) {
      employee.date_of_joining = date_of_joining;
    }

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .populate("user_id", "name email role")
      .populate(
        "department_id",
        "departmentId departmentName description location status"
      )
      .populate("manager_id", "employee_code designation");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("UPDATE MY PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};