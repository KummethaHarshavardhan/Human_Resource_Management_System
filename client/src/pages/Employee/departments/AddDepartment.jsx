import { useState } from "react";
import { addDepartment } from "../../../services/departmentService";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    departmentName: "",
    departmentCode: "",
    manager: "",
    employeeCount: "",
    location: "",
    status: "Active",
  });

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
      !department.manager ||
      !department.location
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await addDepartment(department);
      alert(response.message);

      setDepartment({
        departmentName: "",
        departmentCode: "",
        manager: "",
        employeeCount: "",
        location: "",
        status: "Active",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add department.");
    }
  };

  const handleReset = () => {
    setDepartment({
      departmentName: "",
      departmentCode: "",
      manager: "",
      employeeCount: "",
      location: "",
      status: "Active",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Department</h2>

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

        <button type="submit">Save Department</button>

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

export default AddDepartment;