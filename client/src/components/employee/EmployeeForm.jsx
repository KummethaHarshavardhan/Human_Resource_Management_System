import { useState, useEffect, useRef } from "react";
import "../employee/emp.shared.css";
import "../employee/EmployeeForm.css";

const EMPTY = {
  user_id: "",
  department_id: "",
  designation: "",
  manager_id: "",
  date_of_joining: "",
  employment_status: "Active",
};

export default function EmployeeForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  departments = [],
  employees = [],
  users = [],
  title = "Employee Details",
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState({});
  const initialDataStr = JSON.stringify(initialData);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({ ...EMPTY, ...initialData });
    }
  }, [initialDataStr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.user_id) errs.user_id = "User is required";
    if (!form.department_id) errs.department_id = "Department is required";
    if (!form.designation.trim()) errs.designation = "Designation is required";
    if (!form.date_of_joining) errs.date_of_joining = "Date of joining is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      user_id: form.user_id,
      department_id: form.department_id,
      designation: form.designation.trim(),
      manager_id: form.manager_id || null,
      date_of_joining: form.date_of_joining,
      employment_status: form.employment_status,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="emp-form-card">
        <h2>{title}</h2>
        <div className="emp-form-grid">

          {users.length > 0 ? (
            <div className="emp-form-group full-width">
              <label className="emp-form-label">
                User Account <span>*</span>
              </label>
              <select
                name="user_id"
                className={`emp-form-select${errors.user_id ? " error" : ""}`}
                value={form.user_id}
                onChange={handleChange}
              >
                <option value="">— Select User —</option>
                {users.map((u) => (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <span className="emp-field-error">{errors.user_id}</span>
              )}
            </div>
          ) : (
            <div className="emp-form-group full-width">
              <label className="emp-form-label">
                User ID / Account <span>*</span>
              </label>
              <input
                type="text"
                name="user_id"
                className={`emp-form-input${errors.user_id ? " error" : ""}`}
                placeholder="User ID"
                value={form.user_id}
                onChange={handleChange}
              />
              {errors.user_id && (
                <span className="emp-field-error">{errors.user_id}</span>
              )}
            </div>
          )}

          <div className="emp-form-group">
            <label className="emp-form-label">
              Designation <span>*</span>
            </label>
            <input
              type="text"
              name="designation"
              className={`emp-form-input${errors.designation ? " error" : ""}`}
              placeholder="e.g. Senior Developer"
              value={form.designation}
              onChange={handleChange}
            />
            {errors.designation && (
              <span className="emp-field-error">{errors.designation}</span>
            )}
          </div>

          <div className="emp-form-group">
            <label className="emp-form-label">
              Department <span>*</span>
            </label>
            <select
              name="department_id"
              className={`emp-form-select${errors.department_id ? " error" : ""}`}
              value={form.department_id}
              onChange={handleChange}
            >
              <option value="">— Select Department —</option>
              {departments.map((d) => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  {d.departmentName}
                </option>
              ))}
            </select>
            {errors.department_id && (
              <span className="emp-field-error">{errors.department_id}</span>
            )}
          </div>

          <div className="emp-form-group">
            <label className="emp-form-label">
              Date of Joining <span>*</span>
            </label>
            <input
              type="date"
              name="date_of_joining"
              className={`emp-form-input${errors.date_of_joining ? " error" : ""}`}
              value={form.date_of_joining ? String(form.date_of_joining).slice(0, 10) : ""}
              onChange={handleChange}
            />
            {errors.date_of_joining && (
              <span className="emp-field-error">{errors.date_of_joining}</span>
            )}
          </div>

          <div className="emp-form-group">
            <label className="emp-form-label">Employment Status</label>
            <select
              name="employment_status"
              className="emp-form-select"
              value={form.employment_status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="emp-form-group full-width">
            <label className="emp-form-label">Manager (optional)</label>
            <select
              name="manager_id"
              className="emp-form-select"
              value={form.manager_id || ""}
              onChange={handleChange}
            >
              <option value="">— No Manager —</option>
              {employees.map((emp) => (
                <option key={emp._id || emp.id} value={emp._id || emp.id}>
                  {emp.employee_code} – {emp.designation}{" "}
                  {emp.user_id?.name ? `(${emp.user_id.name})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="emp-form-actions">
        <button
          type="button"
          className="emp-btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="emp-btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="emp-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              Saving...
            </>
          ) : (
            "Save Employee"
          )}
        </button>
      </div>
    </form>
  );
}
