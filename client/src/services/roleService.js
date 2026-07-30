// Mock Role Data

const roles = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Rahul Kumar",
    department: "Information Technology",
    role: "Software Engineer",
    assignedDate: "2026-07-01",
    status: "Active",
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Priya Sharma",
    department: "Human Resources",
    role: "HR Executive",
    assignedDate: "2026-06-20",
    status: "Active",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "David Wilson",
    department: "Finance",
    role: "Accountant",
    assignedDate: "2026-05-15",
    status: "Inactive",
  },
];

// Get All Roles
export const getRoles = async () => {
  return Promise.resolve(roles);
};

// Get Role By ID
export const getRoleById = async (id) => {
  const role = roles.find((item) => item.id === Number(id));
  return Promise.resolve(role);
};

// Assign Role
export const assignRole = async (roleData) => {
  return Promise.resolve({
    success: true,
    message: "Role assigned successfully.",
    data: roleData,
  });
};

// Update Role
export const updateRole = async (id, roleData) => {
  return Promise.resolve({
    success: true,
    message: "Role updated successfully.",
    data: roleData,
  });
};

// Remove Role
export const removeRole = async (id) => {
  return Promise.resolve({
    success: true,
    message: "Role removed successfully.",
  });
};