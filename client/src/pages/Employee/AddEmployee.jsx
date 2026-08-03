import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import EmployeeForm from "../../components/employee/EmployeeForm.jsx";
import { createEmployee, getAllEmployees } from "../../services/employeeService.js";
import { getAllDepartments } from "../../services/profileService.js";
import "../../components/employee/emp.shared.css";
import "../../components/employee/EmployeeForm.css";
import { FiArrowLeft } from "react-icons/fi";

async function fetchUsers() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/users", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.users || data || [];
}

export default function AddEmployee() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "";



  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      getAllDepartments(),
      getAllEmployees({ page: 1, limit: 100 }),
      fetchUsers(),
    ])
      .then(([deptData, empData, userData]) => {
        setDepartments(deptData?.departments || []);
        setEmployees(empData?.employees || []);
        setUsers(Array.isArray(userData) ? userData : []);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try{
      await createEmployee(formData);
      setSuccess("Employee created successfully!");
      setTimeout(() => navigate("/employee"), 1400);
    }catch(err) {
      setError(err.message || "Failed to create employee");
    }finally {
      setLoading(false);
    }
  };

  return(
    <div className="emp-page">
      <div className="emp-page-header">
        <div className="emp-page-header-text">
          <h1>Add New Employee</h1>
          <p>Fill in the details to onboard a new employee.</p>
        </div>
        <Link
          to="/employee"
          className="emp-btn-secondary"
          id="add-emp-back-btn"
          style={{ cursor: "pointer" }}
        >
          <FiArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      {error && <div className="emp-alert error">{error}</div>}
      {success && <div className="emp-alert success">{success}</div>}

      <div className="emp-form-page">
        <EmployeeForm
          title="Employee Information"
          departments={departments}
          employees={employees}
          users={users}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/employee")}
        />
      </div>
    </div>
  );
}