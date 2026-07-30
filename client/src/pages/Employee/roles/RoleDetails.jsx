import { useEffect, useState } from "react";
import { getRoleById } from "../../../services/roleService";

const RoleDetails = () => {
  // Temporary ID (later this will come from React Router)
  const roleId = 1;

  const [role, setRole] = useState(null);

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      const data = await getRoleById(roleId);
      setRole(data);
    } catch (error) {
      console.error("Error loading role:", error);
    }
  };

  if (!role) {
    return <h2>Loading Role Details...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Role Details</h2>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        width="60%"
      >
        <tbody>
          <tr>
            <th>Employee ID</th>
            <td>{role.employeeId}</td>
          </tr>

          <tr>
            <th>Employee Name</th>
            <td>{role.employeeName}</td>
          </tr>

          <tr>
            <th>Department</th>
            <td>{role.department}</td>
          </tr>

          <tr>
            <th>Role</th>
            <td>{role.role}</td>
          </tr>

          <tr>
            <th>Assigned Date</th>
            <td>{role.assignedDate}</td>
          </tr>

          <tr>
            <th>Status</th>
            <td>{role.status}</td>
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

export default RoleDetails;