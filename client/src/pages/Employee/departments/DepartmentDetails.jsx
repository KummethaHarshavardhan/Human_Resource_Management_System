import { useEffect, useState } from "react";
import { getDepartmentById } from "../../../services/departmentService";

const DepartmentDetails = () => {
  // Temporary ID (later it will come from React Router)
  const departmentId = 1;

  const [department, setDepartment] = useState(null);

  useEffect(() => {
    loadDepartment();
  }, []);

  const loadDepartment = async () => {
    try {
      const data = await getDepartmentById(departmentId);
      setDepartment(data);
    } catch (error) {
      console.error("Error loading department:", error);
    }
  };

  if (!department) {
    return <h2>Loading Department Details...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Department Details</h2>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        width="60%"
      >
        <tbody>
          <tr>
            <th>ID</th>
            <td>{department.id}</td>
          </tr>

          <tr>
            <th>Department Name</th>
            <td>{department.departmentName}</td>
          </tr>

          <tr>
            <th>Department Code</th>
            <td>{department.departmentCode}</td>
          </tr>

          <tr>
            <th>Manager</th>
            <td>{department.manager}</td>
          </tr>

          <tr>
            <th>Employee Count</th>
            <td>{department.employeeCount}</td>
          </tr>

          <tr>
            <th>Location</th>
            <td>{department.location}</td>
          </tr>

          <tr>
            <th>Status</th>
            <td>{department.status}</td>
          </tr>
        </tbody>
      </table>

      <br />

      <button onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
};

export default DepartmentDetails;