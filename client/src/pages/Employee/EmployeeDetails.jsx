import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import EmployeeDetailsCard from "../../components/employee/EmployeeDetailsCard.jsx";
import ConfirmModal from "../../components/Modal/ConfirmModal.jsx";
import {
  getEmployeeById,
  updateEmployeeStatus,
  deleteEmployee,
} from "../../services/employeeService.js";
import "../../components/employee/emp.shared.css";
import "../../components/employee/EmployeeDetailsCard.css";
import "./EmployeeList.css";
import { normalizeRole } from "../../utils/permission.js";
import { FiArrowLeft, FiXCircle, FiCheckCircle, FiSearch } from "react-icons/fi";

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const normRole = normalizeRole(user?.role);
  const canEdit = normRole === "admin" || normRole === "hr_manager";

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    getEmployeeById(id)
      .then((data) => setEmployee(data?.employee || null))
      .catch((err) => setError(err.message || "Failed to load employee"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleStatus = async () => {
    if (!employee) return;
    const newStatus =
      employee.employment_status === "Active" ? "Inactive" : "Active";
    setStatusLoading(true);
    try {
      const data = await updateEmployeeStatus(id, newStatus);
      setEmployee(data?.employee || employee);
      showToast('success', `Status updated to ${newStatus}`);
    } catch (err) {
      showToast('error', err.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(id);
      showToast('success', "Employee deactivated successfully.");
      navigate("/employee");
    } catch (err) {
      showToast('error', err.message || "Failed to deactivate employee");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (emp) => {
    if (!canEdit) {
      showToast('error', "You do not have permission to edit employee details.");
      return;
    }
    navigate(`/employee/${emp._id || emp.id}/edit`);
  };

  const handleDeleteClick = () => {
    if (!canEdit) {
      showToast('error', "You do not have permission to deactivate employees.");
      return;
    }
    setConfirmDelete(true);
  };

  if (loading) {
    return (
      <div className="emp-page">
        <div className="emp-loading">
          <span className="emp-spinner" />
          Loading employee details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="emp-page">
        <div className="emp-alert error">{error}</div>
        <button className="emp-btn-secondary" onClick={() => navigate("/employee")}>
          <FiArrowLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="emp-page">
        <div className="emp-empty-state">
          <div className="emp-empty-icon"><FiSearch size={48} /></div>
          <p>Employee not found</p>
        </div>
        <button
          className="emp-btn-secondary"
          style={{ marginTop: 12 }}
          onClick={() => navigate("/employee")}
        >
          <FiArrowLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  const name =
    (typeof employee?.user_id === "object" && employee?.user_id?.name) ||
    employee?.name ||
    "this employee";

  return (
    <div className="emp-page">
      {canEdit && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button
            type="button"
            className="emp-btn-secondary"
            onClick={handleToggleStatus}
            disabled={statusLoading}
            id="toggle-status-btn"
            aria-label={`Toggle status to ${employee.employment_status === "Active" ? "Inactive" : "Active"}`}
          >
            {statusLoading
              ? "Updating..."
              : employee.employment_status === "Active"
              ? <><FiXCircle size={15} /> Mark Inactive</>
              : <><FiCheckCircle size={15} /> Mark Active</>}
          </button>
        </div>
      )}

      <EmployeeDetailsCard
        employee={employee}
        canEdit={true}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onBack={() => navigate("/employee")}
      />

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Employee?"
        message={`Are you sure you want to deactivate ${name} (${employee.employee_code || "EMP"})? Historical records across payroll, leave, and attendance will be preserved.`}
        confirmText="Deactivate"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
