import { useEffect, useState } from "react";
import {
  getDepartmentById,
  updateDepartment,
} from "../../../services/departmentService";

const EditDepartment = () => {
  // Temporary ID (later this will come from React Router)
  const departmentId = 1;

  const [department, setDepartment] = useState({
    departmentName: "",
    departmentCode: "",
    manager: "",
    employeeCount: "",
    location: "",
    status: "Active",
  });

  useEffect(() => {
    loadDepartment();
  }, []);

  const loadDepartment = async () => {
    try {
      const data = await getDepartmentById(departmentId);

      if (data) {
        setDepartment(data);
      }
    } catch (error) {
      console.error("Error loading department:", error);
    }
  };

  const handleChange = (e) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !department.departmentName ||
      !department.departmentCode ||
      !department.manager
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await updateDepartment(
        departmentId,
        department
      );

      alert(response.message);
    } catch (error) {
      console.error(error);
      alert("Failed to update department.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Department</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Department Name</label>
          <br />
          <input
            type="text"
            name="departmentName"
            value={department.departmentName}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Department Code</label>
          <br />
          <input
            type="text"
            name="departmentCode"
            value={department.departmentCode}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Manager</label>
          <br />
          <input
            type="text"
            name="manager"
            value={department.manager}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Employee Count</label>
          <br />
          <input
            type="number"
            name="employeeCount"
            value={department.employeeCount}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />
          <input
            type="text"
            name="location"
            value={department.location}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={department.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <br />

        <button type="submit">Update Department</button>
      </form>
    </div>
  );
};

export default EditDepartment;