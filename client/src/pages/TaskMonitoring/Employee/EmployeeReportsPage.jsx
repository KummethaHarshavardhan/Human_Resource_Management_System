import React, { useState, useEffect, useMemo } from "react";
import {
  FiTrendingUp,
  FiClock,
  FiAlertTriangle,
  FiRefreshCw,
  FiDownload,
  FiCheckCircle,
  FiFileText,
  FiSearch,
} from "react-icons/fi";
import { taskReportService } from "../../../services/taskReportService.js";
import Card from "../../../components/Card/Card.jsx";
import Table from "../../../components/Table/Table.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import "./EmployeeTaskMonitoring.css";
import "../Reports/ReportsOverviewPage.css";

export default function EmployeeReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState({
    kpi: {},
    statusDistribution: [],
    deadlineStats: {},
  });
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: "", subtitle: "" });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resOverview, resTasks] = await Promise.all([
        taskReportService.getOverview(),
        taskReportService.getTaskReports(),
      ]);

      setOverview(resOverview.data || {});
      setTasks(resTasks.data?.report || []);
    } catch (err) {
      console.error("Failed to load employee reports:", err);
      setError(err.message || "Failed to load performance reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const { kpi = {}, statusDistribution = [], deadlineStats = {} } = overview;

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const s = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.taskTitle?.toLowerCase().includes(s) ||
        t.status?.toLowerCase().includes(s) ||
        t.priority?.toLowerCase().includes(s)
    );
  }, [tasks, search]);

  const handleExportCSV = () => {
    const headers = ["Task Title", "Priority", "Status", "Deadline", "Is Overdue", "Latest Review Decision", "Review Comments"];
    const rows = tasks.map((t) => [
      `"${t.taskTitle}"`,
      t.priority,
      t.status,
      t.deadline ? new Date(t.deadline).toLocaleDateString() : "-",
      t.isOverdue ? "YES" : "NO",
      t.latestReviewDecision || "PENDING",
      `"${(t.latestReviewComments || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `my_performance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Donut Chart Calculations
  const donutItems = useMemo(() => {
    const defaultColorMap = {
      Completed: "#10b981",
      "In Progress": "#0ea5e9",
      Submitted: "#818cf8",
      Pending: "#94a3b8",
      "Rework Required": "#f59e0b",
    };

    if (statusDistribution && statusDistribution.length > 0) {
      return statusDistribution.map((s) => ({
        name: s.name,
        value: s.value || 0,
        color: s.color || defaultColorMap[s.name] || "#64748b",
      }));
    }

    return [
      { name: "Completed", value: kpi.completedTasks || 0, color: "#10b981" },
      { name: "In Progress", value: kpi.inProgressTasks || 0, color: "#0ea5e9" },
      { name: "Submitted", value: kpi.submittedTasks || 0, color: "#818cf8" },
      { name: "Pending", value: kpi.pendingTasks || 0, color: "#94a3b8" },
      { name: "Rework Required", value: kpi.reworkTasks || 0, color: "#f59e0b" },
    ];
  }, [statusDistribution, kpi]);

  const totalDonutTasks = useMemo(() => {
    return donutItems.reduce((acc, item) => acc + item.value, 0);
  }, [donutItems]);

  const donutSize = 180;
  const strokeWidth = 24;
  const donutRadius = (donutSize - strokeWidth) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;

  // Deadline Timeliness Bar Chart
  const deadlineBars = useMemo(() => {
    return [
      { label: "On Time", count: deadlineStats.completedOnTime || 0, color: "#10b981" },
      { label: "Due Today", count: deadlineStats.dueToday || 0, color: "#f59e0b" },
      { label: "Overdue", count: deadlineStats.overdue || 0, color: "#ef4444" },
      { label: "Upcoming", count: deadlineStats.upcoming || 0, color: "#0ea5e9" },
    ];
  }, [deadlineStats]);

  const maxDeadline = useMemo(() => {
    let max = 4;
    deadlineBars.forEach((b) => {
      if (b.count > max) max = b.count;
    });
    return Math.ceil(max * 1.25);
  }, [deadlineBars]);

  const columns = [
    {
      key: "task",
      header: "Task Title",
      width: "35%",
      render: (row) => (
        <div>
          <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
            {row.taskTitle}
          </strong>
          <span className={`etm-badge etm-priority-${(row.priority || "MEDIUM").toLowerCase()}`} style={{ fontSize: "10px", marginTop: 4 }}>
            {row.priority}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "15%",
      render: (row) => {
        const s = (row.status || "PENDING").toLowerCase().replace("_", "-");
        return <span className={`etm-badge etm-badge-${s}`}>{row.status}</span>;
      },
    },
    {
      key: "deadline",
      header: "Deadline",
      width: "20%",
      render: (row) => (
        <div>
          <span style={{ fontSize: "12px" }}>
            {row.deadline ? new Date(row.deadline).toLocaleDateString() : "-"}
          </span>
          {row.isOverdue && (
            <span className="etm-badge etm-badge-overdue" style={{ marginLeft: 6 }}>
              OVERDUE
            </span>
          )}
        </div>
      ),
    },
    {
      key: "review",
      header: "Review Decision & Feedback",
      width: "30%",
      render: (row) => (
        <div>
          <strong
            style={{
              fontSize: "12px",
              color:
                row.latestReviewDecision === "APPROVED"
                  ? "#059669"
                  : row.latestReviewDecision === "REWORK_REQUIRED"
                  ? "#d97706"
                  : "#64748b",
            }}
          >
            {row.latestReviewDecision || "PENDING"}
          </strong>
          {row.latestReviewComments && (
            <span style={{ fontSize: "11px", color: "#64748b", display: "block", marginTop: 2 }}>
              "{row.latestReviewComments}"
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="etm-container">
      {/* Header */}
      <div className="etm-header">
        <div className="etm-header-left">
          <div className="etm-breadcrumb">
            Task Monitoring <span>/</span> Performance Reports
          </div>
          <h1 className="etm-title">My Performance & Evaluation Reports</h1>
          <p className="etm-subtitle">
            Personal performance audit, delivery speed, and milestone compliance analysis
          </p>
        </div>

        <div className="etm-header-actions">
          <button type="button" className="etm-btn-outline" onClick={handleExportCSV}>
            <FiDownload size={14} /> Export CSV
          </button>
          <button type="button" className="etm-btn-primary" onClick={fetchReports}>
            <FiRefreshCw size={14} /> Refresh Analytics
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            margin: "16px 0",
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#991b1b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiAlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchReports}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Loader.Spinner size="lg" />
          <p style={{ marginTop: 12, color: "#64748b" }}>Loading performance intelligence...</p>
        </div>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <div className="etm-kpi-grid">
            <div className="etm-kpi-card">
              <div className="etm-kpi-icon etm-icon-emerald">
                <FiTrendingUp />
              </div>
              <div className="etm-kpi-info">
                <span className="etm-kpi-label">COMPLETION EFFICIENCY</span>
                <span className="etm-kpi-value">{kpi.completionRate || 0}%</span>
                <span className="etm-kpi-subtext">
                  {kpi.completedTasks || 0} of {kpi.totalAssignments || 0} tasks
                </span>
              </div>
            </div>

            <div className="etm-kpi-card">
              <div className="etm-kpi-icon etm-icon-blue">
                <FiClock />
              </div>
              <div className="etm-kpi-info">
                <span className="etm-kpi-label">ON-TIME COMPLETION</span>
                <span className="etm-kpi-value">{kpi.onTimeRate || 0}%</span>
                <span className="etm-kpi-subtext">Met target deadline</span>
              </div>
            </div>

            <div className="etm-kpi-card">
              <div className="etm-kpi-icon etm-icon-coral">
                <FiAlertTriangle />
              </div>
              <div className="etm-kpi-info">
                <span className="etm-kpi-label">OVERDUE RATIO</span>
                <span className="etm-kpi-value">{kpi.overdueTasks || 0}</span>
                <span className="etm-kpi-subtext">Active delayed tasks</span>
              </div>
            </div>

            <div className="etm-kpi-card">
              <div className="etm-kpi-icon etm-icon-amber">
                <FiRefreshCw />
              </div>
              <div className="etm-kpi-info">
                <span className="etm-kpi-label">ACTIVE REWORKS</span>
                <span className="etm-kpi-value">{kpi.reworkTasks || 0}</span>
                <span className="etm-kpi-subtext">Revision cycle</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Task Status Breakdown Donut */}
            <div className="epr-chart-card">
              <div className="epr-chart-header">
                <div>
                  <h3 className="epr-chart-title">Task Status Breakdown</h3>
                  <p className="epr-chart-subtitle">Distribution of your assigned tasks</p>
                </div>
              </div>

              <div className="epr-donut-wrapper">
                <div className="epr-donut-svg-container">
                  <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`}>
                    {totalDonutTasks === 0 ? (
                      <circle
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                      />
                    ) : (
                      (() => {
                        let accumulatedOffset = 0;
                        return donutItems.map((item, idx) => {
                          if (item.value <= 0) return null;
                          const dash = (item.value / totalDonutTasks) * donutCircumference;
                          const strokeDasharray = `${dash} ${donutCircumference}`;
                          const strokeDashoffset = -accumulatedOffset;
                          accumulatedOffset += dash;

                          return (
                            <circle
                              key={idx}
                              className="epr-donut-segment"
                              cx={donutSize / 2}
                              cy={donutSize / 2}
                              r={donutRadius}
                              fill="transparent"
                              stroke={item.color}
                              strokeWidth={strokeWidth}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              transform={`rotate(-90 ${donutSize / 2} ${donutSize / 2})`}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltip({
                                  visible: true,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                  title: item.name,
                                  subtitle: `Count: ${item.value}`,
                                });
                              }}
                              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, title: "", subtitle: "" })}
                            />
                          );
                        });
                      })()
                    )}
                  </svg>

                  <div className="epr-donut-center-label">
                    <div className="epr-donut-center-count">{totalDonutTasks}</div>
                    <div className="epr-donut-center-text">Total Tasks</div>
                  </div>
                </div>

                <div className="epr-chart-legend">
                  {donutItems.map((item) => (
                    <div key={item.name} className="epr-legend-item">
                      <span className="epr-legend-dot" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                      <strong style={{ color: "#0f172a", marginLeft: 2 }}>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deadline Timeliness */}
            <div className="epr-chart-card">
              <div className="epr-chart-header">
                <div>
                  <h3 className="epr-chart-title">Deadline Timeliness</h3>
                  <p className="epr-chart-subtitle">On-time vs delayed deliverables</p>
                </div>
              </div>

              <div className="epr-svg-bar-container">
                <svg width="100%" height="220" viewBox="0 0 340 220" preserveAspectRatio="none">
                  {[0, 1, 2, 3, 4].map((step) => {
                    const yVal = Math.round((maxDeadline / 4) * step);
                    const yPos = 180 - (step / 4) * 140;
                    return (
                      <g key={step}>
                        <line x1="36" y1={yPos} x2="330" y2={yPos} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <text x="24" y={yPos + 4} fontSize="10" fill="#94a3b8" textAnchor="end">
                          {yVal}
                        </text>
                      </g>
                    );
                  })}

                  {deadlineBars.map((bar, idx) => {
                    const barX = 52 + idx * 70;
                    const chartH = 140;
                    const h = maxDeadline > 0 ? (bar.count / maxDeadline) * chartH : 0;

                    return (
                      <g key={bar.label}>
                        <rect
                          className="epr-bar-column"
                          x={barX}
                          y={180 - h}
                          width="36"
                          height={Math.max(h, 3)}
                          rx="4"
                          fill={bar.color}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              visible: true,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                              title: bar.label,
                              subtitle: `Tasks: ${bar.count}`,
                            });
                          }}
                          onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, title: "", subtitle: "" })}
                        />
                        <text
                          x={barX + 18}
                          y="202"
                          fontSize="10"
                          fontWeight="600"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          {bar.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Task Audit Roster Table */}
          <div className="etm-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                Task Performance Log ({tasks.length})
              </h3>
              <div className="etm-search-wrapper" style={{ maxWidth: 280 }}>
                <FiSearch className="etm-search-icon" />
                <input
                  type="text"
                  className="etm-search-input"
                  placeholder="Filter tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Table
              columns={columns}
              data={filteredTasks}
              loading={false}
              emptyText="No performance records available."
            />
          </div>
        </>
      )}

      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="epr-floating-tooltip"
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <strong>{tooltip.title}</strong>
          <span>{tooltip.subtitle}</span>
        </div>
      )}
    </div>
  );
}
