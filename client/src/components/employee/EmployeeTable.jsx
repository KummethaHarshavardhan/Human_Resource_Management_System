import { useState } from "react";
import "../employee/emp.shared.css";
import "../employee/EmployeeTable.css";
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";

const avatarColors = [
  "#7c3aed", "#2563eb", "#0891b2", "#059669",
  "#d97706", "#dc2626", "#9333ea", "#db2777",
];

function getColor(name = "") {
  const code = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
  return avatarColors[code % avatarColors.length];
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const cls =
    status === "Active" ? "active" : status === "Inactive" ? "inactive" : "on-leave";
  return <span className={`emp-badge ${cls}`}>{status || "—"}</span>;
}

function Pagination({ currentPage, totalPages, totalEmployees, pageSize, onPage }) {
  const start = totalEmployees > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalEmployees);

  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="emp-pagination">
      <span className="emp-pagination-info">
        Showing {start} to {end} of {totalEmployees.toLocaleString()} results
      </span>
      <div className="emp-pagination-controls">
        <button
          className="emp-page-nav-btn"
          onClick={() => onPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FiChevronLeft size={16} />
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="emp-page-dots">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`emp-page-num-btn${p === currentPage ? " active" : ""}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="emp-page-nav-btn"
          onClick={() => onPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: "name_asc",    label: "Name (A → Z)" },
  { value: "name_desc",   label: "Name (Z → A)" },
  { value: "date_desc",   label: "Join Date (Newest)" },
  { value: "date_asc",    label: "Join Date (Oldest)" },
  { value: "status_asc",  label: "Status (Active First)" },
  { value: "status_desc", label: "Status (Inactive First)" },
];

function getEmpCode(emp) {
  const raw = emp.employee_code || emp.employeeCode;
  if (raw && !/^[0-9a-fA-F]{24}$/.test(raw)) return raw;
  const id = emp._id || emp.id || "";
  return id ? `EMP-${String(id).slice(-6).toUpperCase()}` : "—";
}

function sortEmployees(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case "name_asc":
      return sorted.sort((a, b) => (a.user_id?.name || a.name || "").localeCompare(b.user_id?.name || b.name || ""));
    case "name_desc":
      return sorted.sort((a, b) => (b.user_id?.name || b.name || "").localeCompare(a.user_id?.name || a.name || ""));
    case "date_asc":
      return sorted.sort((a, b) => new Date(a.date_of_joining || a.createdAt) - new Date(b.date_of_joining || b.createdAt));
    case "date_desc":
      return sorted.sort((a, b) => new Date(b.date_of_joining || b.createdAt) - new Date(a.date_of_joining || a.createdAt));
    case "status_asc":
      return sorted.sort((a, b) => (a.employment_status || "").localeCompare(b.employment_status || ""));
    case "status_desc":
      return sorted.sort((a, b) => (b.employment_status || "").localeCompare(a.employment_status || ""));
    default:
      return sorted;
  }
}

export default function EmployeeTable({
  employees = [],
  totalEmployees = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  search = "",
  status = "",
  deptFilter = "All Departments",
  departments = [],
  onSearch,
  onStatus,
  onDeptFilter,
  onPage,
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  loading = false,
}) {
<<<<<<< HEAD
  const [sortBy, setSortBy] = useState("name_asc");

  const defaultDepts = ["All Departments"];
  const dynamicDepts = departments.map((d) => d.departmentName).filter(Boolean);
  const deptTabs = Array.from(new Set([...defaultDepts, ...dynamicDepts]));
=======
  // Generate department filter tabs dynamically from real database departments ONLY
  const dynamicDepts = (departments || [])
    .map((d) => (typeof d === "string" ? d : d?.departmentName || d?.name || d?.department_name))
    .filter(Boolean);

  const empDepts = (employees || [])
    .map((e) => (typeof e?.department_id === "object" ? e?.department_id?.departmentName : e?.department))
    .filter(Boolean);

  const realDepts = Array.from(new Set([...dynamicDepts, ...empDepts]));
  const deptTabs = ["All Departments", ...realDepts];

>>>>>>> origin/team2-reeshika

  const displayedEmployees = sortEmployees(employees, sortBy);

  return (
    <div className="emp-table-container">
      <div className="emp-table-top-bar">
        <div className="emp-dept-tabs" role="tablist">
          {deptTabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={deptFilter === tab}
              className={`emp-dept-tab${deptFilter === tab ? " active" : ""}`}
              onClick={() => onDeptFilter?.(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sort bar */}
      <div className="emp-filter-bar">
        <div className="emp-search-wrap">
          <FiSearch size={15} className="emp-search-icon" />
          <input
            type="text"
            className="emp-search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            id="emp-table-search"
          />
        </div>

        <select
          className="emp-filter-select"
          value={status}
          onChange={(e) => onStatus?.(e.target.value)}
          id="emp-status-filter"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="emp-sort-wrap">
          <span className="emp-sort-label">
            {sortBy.includes("asc") ? <FiArrowUp size={13} /> : <FiArrowDown size={13} />}
          </span>
          <select
            className="emp-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="emp-sort-select"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="emp-loading">
          <span className="emp-spinner" />
          Loading employees...
        </div>
      ) : employees.length === 0 ? (
        <div className="emp-empty-state">
          <div className="emp-empty-icon"><HiOutlineUserGroup size={48} /></div>
          <p>No employees found in this directory view.</p>
        </div>
      ) : (
        <div className="emp-table-wrapper">
          <table className="emp-table" role="grid">
            <thead>
              <tr>
                <th>EMP ID</th>
                <th>EMPLOYEE NAME</th>
                <th>DEPARTMENT</th>
                <th>ROLE</th>
                <th>JOIN DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.map((emp) => {
                const name = emp.user_id?.name || emp.name || "Unknown";
                const email = emp.user_id?.email || emp.email || "";
                const dept = emp.department_id?.departmentName || emp.department || "—";
                const designation = emp.designation || emp.role || "—";
                const joinDate = formatDate(emp.date_of_joining || emp.createdAt);
                const empStatus = emp.employment_status || emp.status || "Active";
                const avatarUrl = emp.user_id?.avatar || emp.avatar;

                return (
                  <tr key={emp._id || emp.id}>
                    <td><code style={{ fontSize: 12, background: "var(--emp-surface,#f4f4f8)", padding: "2px 6px", borderRadius: 4 }}>{getEmpCode(emp)}</code></td>
                    <td>
                      <div
                        className="emp-name-cell"
                        style={{ cursor: "pointer" }}
                        onClick={() => onView?.(emp)}
                        title="View employee details"
                      >
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={name} className="emp-avatar-img" />
                        ) : (
                          <div
                            className="emp-avatar"
                            style={{ background: getColor(name) }}
                          >
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="emp-name-info">
                          <strong>{name}</strong>
                          <span>{email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{dept}</td>
                    <td>{designation}</td>
                    <td>{joinDate}</td>
                    <td>
                      <StatusBadge status={empStatus} />
                    </td>
                    <td>
                      <div className="emp-action-btns">
                        <button
                          className="emp-action-icon-btn"
                          title="View Details"
                          onClick={() => onView?.(emp)}
                          id={`view-emp-${emp._id || emp.id}`}
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="emp-action-icon-btn"
                          title="Edit Employee"
                          onClick={() => onEdit?.(emp)}
                          id={`edit-emp-${emp._id || emp.id}`}
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="emp-action-icon-btn delete"
                          title="Delete Employee"
                          onClick={() => onDelete?.(emp)}
                          id={`delete-emp-${emp._id || emp.id}`}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEmployees={totalEmployees}
          pageSize={pageSize}
          onPage={onPage}
        />
      )}
    </div>
  );
}