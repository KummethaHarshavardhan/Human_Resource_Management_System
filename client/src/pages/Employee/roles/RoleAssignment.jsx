import { useState } from "react";
import { assignRole } from "../../../services/roleService";

const RoleAssignment = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    role: "",
    assignedDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.employeeName ||
      !formData.department ||
      !formData.role
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await assignRole(formData);
      alert(response.message);

      setFormData({
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

  const handleReset = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      department: "",
      role: "",
      assignedDate: "",
      status: "Active",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assign Role</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID</label><br />
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Employee Name</label><br />
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Department</label><br />
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Role</label><br />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Assigned Date</label><br />
          <input
            type="date"
            name="assignedDate"
            value={formData.assignedDate}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Status</label><br />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <br />

        <button type="submit">Assign Role</button>

        <button
          type="button"
          onClick={handleReset}
          style={{ marginLeft: "10px" }}
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default RoleAssignment;