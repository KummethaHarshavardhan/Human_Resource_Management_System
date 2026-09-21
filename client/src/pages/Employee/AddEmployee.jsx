import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import EmployeeForm from "../../components/employee/EmployeeForm.jsx";
import { createEmployee, getAllEmployees } from "../../services/employeeService.js";
import { getAllDepartments } from "../../services/profileService.js";
import { createOnboarding } from "../../services/onboardingService.js";
import "../../components/employee/emp.shared.css";
import "../../components/employee/EmployeeForm.css";
import {
  FiArrowLeft,
  FiCheckSquare,
  FiCopy,
  FiCheck,
  FiKey,
  FiExternalLink,
  FiInfo,
  FiUserPlus,
  FiList,
  FiUsers,
} from "react-icons/fi";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "../../components/Modal/Modal.jsx";

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
  const { showToast } = useToast();
  const navigate = useNavigate();
  const role = user?.role || "";

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [autoOnboard, setAutoOnboard] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdOnboardingId, setCreatedOnboardingId] = useState("");

  useEffect(() => {
    Promise.all([
      getAllDepartments(),
      getAllEmployees({ page: 1, limit: 200 }),
      fetchUsers(),
    ])
      .then(([deptData, empData, userData]) => {
        setDepartments(deptData?.departments || deptData?.data || (Array.isArray(deptData) ? deptData : []));
        const empList = empData?.employees || empData?.data || (Array.isArray(empData) ? empData : []);
        setEmployees(empList);
        const rawUsers = Array.isArray(userData) ? userData : userData?.users || [];
        // Only include users who are not yet registered as an employee
        const existingEmpUserIds = new Set(
          empList.map((e) => String(e.user_id?._id || e.user_id || ""))
        );
        const unlinkedUsers = rawUsers.filter(
          (u) => !existingEmpUserIds.has(String(u._id || u.id || ""))
        );
        setUsers(unlinkedUsers);
      })
      .catch((err) => setError(err.message || "Failed to load form data"));
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await createEmployee(formData);
      const newEmp = res?.employee || res?.data;
      const creds = res?.credentials || {
        email: formData.email,
        temporaryPassword: formData.password || "Emp@12345",
        isNewAccount: true,
      };

      let obId = "";
      if (autoOnboard && newEmp?._id) {
        try {
          const obRes = await createOnboarding({ employee_id: newEmp._id });
          obId = obRes?.onboarding?._id || "";
          setCreatedOnboardingId(obId);
        } catch (obErr) {
          console.warn("Auto-onboarding warning:", obErr.message);
        }
      }

      setCreatedCredentials({
        name: newEmp?.user_id?.name || formData.name,
        code: newEmp?.employee_code || "New",
        email: creds.email,
        password: creds.temporaryPassword || formData.password || "Emp@12345",
        isNewAccount: creds.isNewAccount,
      });

      setIsSuccessModalOpen(true);
      showToast("success", "Employee created successfully!");
    } catch (err) {
      const errMsg = err.message || "Failed to create employee";
      setError(errMsg);
      showToast("error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
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



      <div
        style={{
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          padding: "12px 18px",
          borderRadius: 10,
          margin: "8px 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <input
          type="checkbox"
          id="auto-onboard-check"
          checked={autoOnboard}
          onChange={(e) => setAutoOnboard(e.target.checked)}
          style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#4f46e5" }}
        />
        <label
          htmlFor="auto-onboard-check"
          style={{ fontSize: 13, fontWeight: 600, color: "#3730a3", cursor: "pointer" }}
        >
          Automatically initialize standard Onboarding checklist (HR, IT, Admin, Finance) upon creation
        </label>
      </div>

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

      {/* Employee Created Credentials Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate("/employee")}
        maxWidth="540px"
      >
        <ModalHeader onClose={() => navigate("/employee")}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#16a34a" }}>
            <FiCheckSquare size={20} />
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Employee Account Created</span>
          </div>
        </ModalHeader>

        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>
              <strong>{createdCredentials?.name}</strong> ({createdCredentials?.code}) has been successfully created.
            </p>

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Employee Login Credentials
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Login Portal URL:</span>
                <a
                  href="/login"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#2563eb",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    textDecoration: "none",
                  }}
                >
                  http://localhost:5173/login <FiExternalLink size={13} />
                </a>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Login Email:</span>
                <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{createdCredentials?.email}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Temporary Password:</span>
                <code
                  style={{
                    backgroundColor: "#e2e8f0",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    letterSpacing: "0.03em",
                  }}
                >
                  {createdCredentials?.password}
                </code>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const text = `Infinetra HRMS Login Credentials\nPortal URL: ${window.location.origin}/login\nEmail: ${createdCredentials?.email}\nPassword: ${createdCredentials?.password}`;
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                backgroundColor: copied ? "#dcfce7" : "#f1f5f9",
                color: copied ? "#15803d" : "#334155",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.2s",
              }}
            >
              {copied ? (
                <>
                  <FiCheck size={16} /> Credentials Copied to Clipboard!
                </>
              ) : (
                <>
                  <FiCopy size={16} /> Copy Login Credentials
                </>
              )}
            </button>

            <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <FiInfo size={15} style={{ flexShrink: 0, marginTop: "2px", color: "#3b82f6" }} />
              <span>Provide these credentials to the employee so they can sign in. The employee can change their password anytime in Settings &gt; Security.</span>
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            className="emp-btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            onClick={() => {
              setIsSuccessModalOpen(false);
              setCreatedCredentials(null);
              window.location.reload();
            }}
          >
            <FiUserPlus size={15} /> Add Another Employee
          </button>
          {createdOnboardingId && (
            <button
              type="button"
              className="emp-btn-secondary"
              onClick={() => navigate(`/onboarding/${createdOnboardingId}`)}
              style={{ color: "#4f46e5", borderColor: "#c7d2fe", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FiList size={15} /> Go to Onboarding Checklist
            </button>
          )}
          <button
            type="button"
            className="emp-btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            onClick={() => navigate("/employee")}
          >
            <FiUsers size={15} /> Go to Directory
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}