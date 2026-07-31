import "../../styles/employee.css";

import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const employees = [
  {
    id: 1,
    name: "John Smith",
    department: "HR",
    role: "HR Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Emma Watson",
    department: "IT",
    role: "Frontend Developer",
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Johnson",
    department: "Finance",
    role: "Accountant",
    status: "On Leave",
  },
];

const Employee = () => {
  return (
    <div className="employee-page">

      <div className="employee-header">

        <div>
          <h2>Employees</h2>
          <p>Manage all employees</p>
        </div>

        <button className="add-btn">
          <FaPlus />
          Add Employee
        </button>

      </div>

      <div className="employee-toolbar">

        <div className="search-box">

          <FaSearch />

          <input
            placeholder="Search employee..."
          />

        </div>

      </div>

      <table className="employee-table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Department</th>

            <th>Role</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {employees.map((emp) => (

            <tr key={emp.id}>

              <td>{emp.name}</td>

              <td>{emp.department}</td>

              <td>{emp.role}</td>

              <td>

                <span className="status active">

                  {emp.status}

                </span>

              </td>

              <td>

                <button className="icon-btn">

                  <FaEdit />

                </button>

                <button className="icon-btn delete">

                  <FaTrash />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Employee;