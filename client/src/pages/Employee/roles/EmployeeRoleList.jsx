import { useEffect, useState } from "react";
import { getRoles } from "../../../services/roleService";

const EmployeeRoleList = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
      setFilteredRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = roles.filter(
      (role) =>
        role.employeeId.toLowerCase().includes(value) ||
        role.employeeName.toLowerCase().includes(value) ||
        role.department.toLowerCase().includes(value) ||
        role.role.toLowerCase().includes(value)
    );

    setFilteredRoles(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Role Management</h2>

      <input
        type="text"
        placeholder="Search Employee, Department or Role..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: "10px",
          width: "320px",
          marginBottom: "20px",
        }}
      />

      {loading ? (
        <p>Loading Roles...</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="10"
            cellSpacing="0"
            width="100%"
          >
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((item) => (
                  <tr key={item.id}>
                    <td>{item.employeeId}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.department}</td>
                    <td>{item.role}</td>
                    <td>{item.assignedDate}</td>
                    <td>{item.status}</td>

                    <td>
                      <button>View</button>{" "}
                      <button>Edit</button>{" "}
                      <button>Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" align="center">
                    No Role Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <br />

          <strong>Total Roles: {filteredRoles.length}</strong>
        </>
      )}
    </div>
  );
};

export default EmployeeRoleList;