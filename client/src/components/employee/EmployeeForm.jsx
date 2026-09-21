import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiRefreshCw, FiCheckCircle, FiInfo } from "react-icons/fi";
import "../employee/emp.shared.css";
import "../employee/EmployeeForm.css";

const EMPTY = {
  user_id: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "Employee",
  department_id: "",
  designation: "",
  manager_id: "",
  date_of_joining: "",
  employment_status: "Active",
  bank_account_number: "",
  pf_percentage: 12,
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
  isEditMode = false,
  linkedUserName = "",
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState({});
  const [userSearch, setUserSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const initialDataStr = JSON.stringify(initialData);

  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz";
    const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const nums = "23456789";
    const specials = "@#$%&*!";

    let pass = "";
    pass += uppers.charAt(Math.floor(Math.random() * uppers.length));
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += nums.charAt(Math.floor(Math.random() * nums.length));
    pass += specials.charAt(Math.floor(Math.random() * specials.length));
    pass += nums.charAt(Math.floor(Math.random() * nums.length));
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += nums.charAt(Math.floor(Math.random() * nums.length));

    setForm((prev) => ({ ...prev, password: pass }));
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  const DEFAULT_DEPT_NAMES = [
    "Human Resource",
    "HR",
    "Manager",
    "Employee",
    "Sales",
    "Executive Administration",
  ];

  const availableDepartments = (() => {
    const list = Array.isArray(departments) ? [...departments] : [];
    const existingNames = new Set(
      list.map((d) => (d.departmentName || d.name || "").trim().toLowerCase())
    );
    for (const name of DEFAULT_DEPT_NAMES) {
      if (!existingNames.has(name.toLowerCase())) {
        list.push({ _id: name, departmentName: name });
        existingNames.add(name.toLowerCase());
      }
    }
    return list;
  })();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({ ...EMPTY, ...initialData }));
      if (initialData.name || initialData.email) {
        setUserSearch(
          initialData.name && initialData.email
            ? `${initialData.name} (${initialData.email})`
            : initialData.email || initialData.name || ""
        );
      }
    }
  }, [initialDataStr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "email" && prev.user_id) {
        const selectedUser = users.find((u) => (u._id || u.id) === prev.user_id);
        if (selectedUser && selectedUser.email?.toLowerCase() !== value.trim().toLowerCase()) {
          updated.user_id = "";
          setUserSearch("");
        }
      }
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const handleUserSelect = (e) => {
    const text = e.target.value;
    setUserSearch(text);
    if (errors.user_id) setErrors((prev) => ({ ...prev, user_id: "" }));
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));

    const match = users.find(
      (u) =>
        u.name?.toLowerCase() === text.toLowerCase() ||
        u.email?.toLowerCase() === text.toLowerCase() ||
        `${u.name} (${u.email})`.toLowerCase() === text.toLowerCase()
    );

    if (match) {
      setForm((prev) => ({
        ...prev,
        user_id: match._id || match.id,
        name: match.name || prev.name,
        email: match.email || prev.email,
        phone: match.phone || prev.phone,
        role: match.role || prev.role || "Employee",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        user_id: text,
        email: text.includes("@") ? text : prev.email,
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) {
      errs.name = "Full name is required";
    }

    if (!form.email?.trim()) {
      errs.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        errs.email = "Please enter a valid email address";
      }
    }

    if (form.phone && form.phone.trim()) {
      const cleaned = form.phone.replace(/\D/g, "");
      if (cleaned.length !== 10) {
        errs.phone = "Phone must be a valid 10-digit number";
      }
    }

    // Password validation (only for newly created accounts when a password is typed)
    if (!isEditMode && !form.user_id && form.password && form.password.trim()) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(form.password.trim())) {
        errs.password =
          "Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character";
      }
    }

    if (!form.department_id) errs.department_id = "Department is required";
    if (!form.designation?.trim()) errs.designation = "Designation is required";
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

    let finalUserId = form.user_id;
    if (finalUserId) {
      const selectedUser = users.find((u) => (u._id || u.id) === finalUserId);
      if (selectedUser && selectedUser.email?.toLowerCase() !== form.email.trim().toLowerCase()) {
        finalUserId = undefined;
      }
    }

    const payload = {
      user_id: finalUserId || undefined,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone ? form.phone.trim() : "",
      password: form.password ? form.password.trim() : undefined,
      role: form.role || "Employee",
      department_id: form.department_id,
      designation: form.designation.trim(),
      manager_id: form.manager_id || null,
      date_of_joining: form.date_of_joining,
      employment_status: form.employment_status,
      bank_account_number: form.bank_account_number ? form.bank_account_number.trim() : "",
      pf_percentage: form.pf_percentage !== undefined ? Number(form.pf_percentage) : 12,
    };
    onSubmit(payload);
  };


  const datalistId = "users-datalist";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="emp-form-card">
        <h2>{title}</h2>
        <div className="emp-form-grid">

          {/* Create mode: User Search / Select dropdown */}
          {!isEditMode && (
            <div className="emp-form-group full-width">
              <label className="emp-form-label">
                Link to Existing User or Create New Account
              </label>

              <datalist id={datalistId}>
                {users.map((u) => (
                  <option key={u._id || u.id} value={`${u.name} (${u.email})`} />
                ))}
              </datalist>

              <input
                type="text"
                list={datalistId}
                className="emp-form-input"
                placeholder="Search existing registered user by name or email…"
                value={userSearch}
                onChange={handleUserSelect}
                autoComplete="off"
              />

              {form.user_id && users.some((u) => (u._id || u.id) === form.user_id) && (
                <span style={{ fontSize: "0.8rem", color: "#16a34a", marginTop: 4, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <FiCheckCircle size={14} /> Existing user account matched and details filled below
                </span>
              )}
            </div>
          )}

          {/* Full Name */}
          <div className="emp-form-group">
            <label className="emp-form-label">
              Full Name <span>*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`emp-form-input${errors.name ? " error" : ""}`}
              placeholder="e.g. Sarah Jenkins"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="emp-field-error">{errors.name}</span>
            )}
          </div>

          {/* Email Address */}
          <div className="emp-form-group">
            <label className="emp-form-label">
              Email Address <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`emp-form-input${errors.email ? " error" : ""}`}
              placeholder="e.g. sarah.jenkins@company.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="emp-field-error">{errors.email}</span>
            )}
          </div>

          {/* Login Password (Create mode only) */}
          {!isEditMode && (
            <div className="emp-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                <label className="emp-form-label" style={{ margin: 0 }}>
                  Login Password {!form.user_id && <span style={{ color: "#64748b", fontWeight: "normal", fontSize: "0.8rem" }}>(Default: Emp@12345)</span>}
                </label>
                {!form.user_id && (
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: "0 4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    title="Auto-generate a secure random password"
                  >
                    <FiRefreshCw size={12} /> Generate
                  </button>
                )}
              </div>

              {form.user_id && users.some((u) => (u._id || u.id) === form.user_id) ? (
                <div style={{ padding: "0.625rem 0.875rem", backgroundColor: "#f1f5f9", borderRadius: "8px", fontSize: "0.85rem", color: "#64748b", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiCheckCircle size={15} color="#16a34a" /> Existing account linked (employee will use their existing password)
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`emp-form-input${errors.password ? " error" : ""}`}
                    placeholder="Enter password or leave blank for Emp@12345"
                    value={form.password}
                    onChange={handleChange}
                    style={{ paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              )}

              {errors.password && (
                <span className="emp-field-error">{errors.password}</span>
              )}
              {!form.user_id && (
                <span style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <FiInfo size={13} style={{ color: "#3b82f6", flexShrink: 0 }} />
                  <span>Temporary login password. The employee will use this to sign in at <strong>/login</strong>.</span>
                </span>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div className="emp-form-group">
            <label className="emp-form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              maxLength={10}
              className={`emp-form-input${errors.phone ? " error" : ""}`}
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="emp-field-error">{errors.phone}</span>
            )}
          </div>

          {/* System Role */}
          <div className="emp-form-group">
            <label className="emp-form-label">System Role</label>
            <select
              name="role"
              className="emp-form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Designation */}
          <div className="emp-form-group">
            <label className="emp-form-label">
              Designation <span>*</span>
            </label>
            <input
              type="text"
              name="designation"
              className={`emp-form-input${errors.designation ? " error" : ""}`}
              placeholder="e.g. Senior Software Engineer"
              value={form.designation}
              onChange={handleChange}
            />
            {errors.designation && (
              <span className="emp-field-error">{errors.designation}</span>
            )}
          </div>

          {/* Department */}
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
              {availableDepartments.map((d) => (
                <option key={d._id || d.id || d.departmentName} value={d._id || d.id || d.departmentName}>
                  {d.departmentName || d.name}
                </option>
              ))}
            </select>
            {errors.department_id && (
              <span className="emp-field-error">{errors.department_id}</span>
            )}
          </div>

          {/* Reporting Manager */}
          <div className="emp-form-group">
            <label className="emp-form-label">Reporting Manager</label>
            <select
              name="manager_id"
              className="emp-form-select"
              value={form.manager_id || ""}
              onChange={handleChange}
            >
              <option value="">— None (No Manager) —</option>
              {employees.map((emp) => {
                const empName = emp.user_id?.name || emp.name || "Employee";
                const empCode = emp.employee_code ? `(${emp.employee_code})` : "";
                return (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {empName} {empCode}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date of Joining */}
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

          {/* Bank Account Number */}
          <div className="emp-form-group">
            <label className="emp-form-label">Bank Account Number</label>
            <input
              type="text"
              name="bank_account_number"
              className="emp-form-input"
              placeholder="e.g. 123456789012"
              value={form.bank_account_number || ""}
              onChange={handleChange}
              style={{ fontFamily: "monospace" }}
            />
          </div>

          {/* Provident Fund (PF) Contribution % */}
          <div className="emp-form-group">
            <label className="emp-form-label">PF Contribution (%)</label>
            <input
              type="number"
              name="pf_percentage"
              min="0"
              max="100"
              step="0.5"
              className="emp-form-input"
              placeholder="12"
              value={form.pf_percentage !== undefined ? form.pf_percentage : 12}
              onChange={handleChange}
            />
          </div>

          {/* Employment Status */}
          <div className="emp-form-group">
            <label className="emp-form-label">Employment Status</label>
            <select
              name="employment_status"
              className="emp-form-select"
              value={form.employment_status}
              onChange={handleChange}
              disabled={isEditMode && initialData?.employment_status === "Inactive"}
              title={
                isEditMode && initialData?.employment_status === "Inactive"
                  ? "Relieved employees can only be reactivated via rejoin/onboarding"
                  : undefined
              }
            >
              {!(isEditMode && initialData?.employment_status === "Inactive") && (
                <option value="Active">Active</option>
              )}
              <option value="Inactive">Inactive</option>
            </select>
            {isEditMode && initialData?.employment_status === "Inactive" && (
              <span style={{ fontSize: "0.8rem", color: "#dc2626", marginTop: 4, display: "block" }}>
                ⚠️ Relieved employees can only be reactivated via rejoin/onboarding. Direct toggle is disabled.
              </span>
            )}
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
          id="save-emp-btn"
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