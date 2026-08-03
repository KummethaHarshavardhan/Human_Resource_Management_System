import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import EmployeeForm from "../../components/employee/EmployeeForm.jsx";
import {
  getEmployeeById,
  updateEmployee,
  getAllEmployees,
} from "../../services/employeeService.js";
import { getAllDepartments } from "../../services/profileService.js";
import "../../components/employee/emp.shared.css";
import "../../components/employee/EmployeeForm.css";
import { FiArrowLeft, FiEye } from "react-icons/fi";

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

export default function EditEmployee() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      getEmployeeById(id),
      getAllDepartments(),
      getAllEmployees({ page: 1, limit: 100 }),
      fetchUsers(),
    ])
      .then(([empData, deptData, allEmpData, userData]) => {
        setEmployee(empData?.employee || null);
        setDepartments(deptData?.departments || deptData?.data || (Array.isArray(deptData) ? deptData : []));
        const others = (allEmpData?.employees || allEmpData?.data || []).filter(
          (e) => (e._id || e.id) !== id
        );
        setEmployees(others);
        setUsers(Array.isArray(userData) ? userData : userData?.users || []);
      })
      .catch((err) => setError(err.message || "Failed to load data"))
      .finally(() => setPageLoading(false));
  }, [id]);

  const initialData = useMemo(() => {
    if (!employee) return {};
    return {
      user_id:
        (typeof employee.user_id === "object" && employee.user_id?._id) ||
        employee.user_id ||
        "",
      department_id:
        (typeof employee.department_id === "object" && employee.department_id?._id) ||
        employee.department_id ||
        "",
      designation: employee.designation || "",
      manager_id:
        (typeof employee.manager_id === "object" && employee.manager_id?._id) ||
        employee.manager_id ||
        "",
      date_of_joining: employee.date_of_joining
        ? new Date(employee.date_of_joining).toISOString().slice(0, 10)
        : "",
      employment_status: employee.employment_status || "Active",
    };
  }, [employee]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateEmployee(id, formData);
      setSuccess("Employee updated successfully!");
      setTimeout(() => navigate(`/employee/${id}`), 1400);
    } catch (err) {
      setError(err.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="emp-page">
        <div className="emp-loading">
          <span className="emp-spinner" />
          Loading employee data...
        </div>
      </div>
    );
  }

  if (!employee && !pageLoading) {
    return (
      <div className="emp-page">
        <div className="emp-alert error">Employee not found.</div>
        <button className="emp-btn-secondary" onClick={() => navigate("/employee")}>
          <FiArrowLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  const empName =
    (typeof employee?.user_id === "object" && employee?.user_id?.name) ||
    employee?.name ||
    "Employee";

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div className="emp-page-header-text">
          <h1>Edit Employee</h1>
          <p>Update details for {empName}.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            to={`/employee/${id}`}
            className="emp-btn-secondary"
            id="edit-emp-view-btn"
          >
            <FiEye size={15} /> View Profile
          </Link>
          <Link
            to="/employee"
            className="emp-btn-secondary"
            id="edit-emp-back-btn"
          >
            <FiArrowLeft size={16} /> Directory
          </Link>
        </div>
      </div>

      {error && <div className="emp-alert error">{error}</div>}
      {success && <div className="emp-alert success">{success}</div>}

      <div className="emp-form-page">
        <EmployeeForm
          key={employee._id || employee.id}
          title={`Editing: ${empName}`}
          initialData={initialData}
          departments={departments}
          employees={employees}
          users={users}
          loading={saving}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/employee/${id}`)}
        />
      </div>
    </div>
  );
}
