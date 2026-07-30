import { useState } from "react";
import { assignRole } from "../../../services/roleService";

const AssignRole = () => {
  const [roleData, setRoleData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    role: "",
    assignedDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setRoleData({
      ...roleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      const response = await assignRole(roleData);
      alert(response.message);

      setRoleData({
        employeeId: "",
        employeeName: "",
        department: "",
        role: "",
        assignedDate: "",
        status: "Active",
      });
    } catch (error) {
      console.error(error);
      alert("Unable to assign role.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assign Employee Role</h2>

      <form onSubmit={handleAssign}>
        <div>
          <label>Employee ID</label>
          <br />
          <input
            type="text"
            name="employeeId"
            value={roleData.employeeId}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Employee Name</label>
          <br />
          <input
            type="text"
            name="employeeName"
            value={roleData.employeeName}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Department</label>
          <br />
          <input
            type="text"
            name="department"
            value={roleData.department}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <br />
          <input
            type="text"
            name="role"
            value={roleData.role}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Assigned Date</label>
          <br />
          <input
            type="date"
            name="assignedDate"
            value={roleData.assignedDate}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">Assign Role</button>
      </form>
    </div>
  );
};

export default AssignRole;