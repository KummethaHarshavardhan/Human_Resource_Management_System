import { useEffect, useState } from "react";
import { getDepartments } from "../../../services/departmentService";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = departments.filter((department) =>
      department.departmentName.toLowerCase().includes(value.toLowerCase()) ||
      department.departmentCode.toLowerCase().includes(value.toLowerCase()) ||
      department.manager.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDepartments(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Department Management</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search Department..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "10px",
            width: "300px",
          }}
        />
      </div>

      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Code</th>
              <th>Manager</th>
              <th>Employees</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td>{department.id}</td>
                  <td>{department.departmentName}</td>
                  <td>{department.departmentCode}</td>
                  <td>{department.manager}</td>
                  <td>{department.employeeCount}</td>
                  <td>{department.location}</td>
                  <td>{department.status}</td>
                  <td>
                    <button>View</button>{" "}
                    <button>Edit</button>{" "}
                    <button>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" align="center">
                  No Departments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px" }}>
        <strong>Total Departments:</strong> {filteredDepartments.length}
      </div>
    </div>
  );
};

export default DepartmentList;