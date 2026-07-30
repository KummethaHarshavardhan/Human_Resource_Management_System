// Mock Department Data
const departments = [
  {
    id: 1,
    departmentName: "Human Resources",
    departmentCode: "HR",
    manager: "John Smith",
    employeeCount: 15,
    location: "Hyderabad",
    status: "Active",
  },
  {
    id: 2,
    departmentName: "Information Technology",
    departmentCode: "IT",
    manager: "Rahul Kumar",
    employeeCount: 42,
    location: "Bengaluru",
    status: "Active",
  },
  {
    id: 3,
    departmentName: "Finance",
    departmentCode: "FIN",
    manager: "David Wilson",
    employeeCount: 18,
    location: "Chennai",
    status: "Active",
  },
  {
    id: 4,
    departmentName: "Marketing",
    departmentCode: "MKT",
    manager: "Priya Sharma",
    employeeCount: 12,
    location: "Mumbai",
    status: "Inactive",
  },
];

// Get All Departments
export const getDepartments = async () => {
  return Promise.resolve(departments);
};

// Get Department By ID
export const getDepartmentById = async (id) => {
  const department = departments.find(
    (dept) => dept.id === Number(id)
  );

  return Promise.resolve(department);
};

// Add Department
export const addDepartment = async (department) => {
  return Promise.resolve({
    success: true,
    message: "Department added successfully",
    data: department,
  });
};

// Update Department
export const updateDepartment = async (id, updatedDepartment) => {
  return Promise.resolve({
    success: true,
    message: "Department updated successfully",
    data: updatedDepartment,
  });
};

// Delete Department
export const deleteDepartment = async (id) => {
  return Promise.resolve({
    success: true,
    message: "Department deleted successfully",
  });
};