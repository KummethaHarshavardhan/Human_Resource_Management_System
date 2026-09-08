import React, { useState, useEffect, useMemo } from "react";
import {
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiUsers,
  FiDownload,
  FiLayers,
  FiFileText,
  FiTrendingUp,
  FiCalendar,
  FiRefreshCw,
  FiArrowRight,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { taskReportService } from "../../../services/taskReportService.js";
import Card from "../../../components/Card/Card.jsx";
import Table from "../../../components/Table/Table.jsx";
import Button from "../../../components/Button/Button.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import "../TaskMonitoring.css";
import "./ReportsOverviewPage.css";

export default function ReportsOverviewPage() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "candidates", "teams", "tasks"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [overview, setOverview] = useState({
    kpi: {},
    statusDistribution: [],
    priorityDistribution: [],
    deadlineStats: {},
  });
  const [candidateReport, setCandidateReport] = useState([]);
  const [teamReport, setTeamReport] = useState([]);
  const [taskReport, setTaskReport] = useState([]);

  // Search filter for detailed views
  const [searchQuery, setSearchQuery] = useState("");

  // Hover tooltip state for charts
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: "", subtitle: "" });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resOverview, resCandidates, resTeams, resTasks] = await Promise.all([
        taskReportService.getOverview(),
        taskReportService.getCandidateReports(),
        taskReportService.getTeamReports(),
        taskReportService.getTaskReports(),
      ]);

      setOverview(resOverview.data || {});
      setCandidateReport(resCandidates.data?.report || []);
      setTeamReport(resTeams.data?.report || []);
      setTaskReport(resTasks.data?.report || []);
    } catch (err) {
      console.error("Failed to load task monitoring reports:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const { kpi = {}, statusDistribution = [], deadlineStats = {} } = overview;

  // Filtered lists for detail tables
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidateReport;
    const q = searchQuery.toLowerCase();
    return candidateReport.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.team?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q)
    );
  }, [candidateReport, searchQuery]);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teamReport;
    const q = searchQuery.toLowerCase();
    return teamReport.filter((t) => t.team?.toLowerCase().includes(q));
  }, [teamReport, searchQuery]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return taskReport;
    const q = searchQuery.toLowerCase();
    return taskReport.filter(
      (t) =>
        t.taskTitle?.toLowerCase().includes(q) ||
        t.candidateName?.toLowerCase().includes(q) ||
        t.candidateTeam?.toLowerCase().includes(q) ||
        t.status?.toLowerCase().includes(q)
    );
  }, [taskReport, searchQuery]);

  // Candidate Report Columns
  const candidateColumns = [
    {
      key: "name",
      header: "Candidate",
      width: "25%",
      render: (row) => (
        <div>
          <strong style={{ fontSize: "13px", color: "var(--slate-900, #0f172a)", display: "block" }}>
            {row.name}
          </strong>
          <span style={{ fontSize: "11px", color: "var(--slate-500, #64748b)" }}>{row.email}</span>
        </div>
      ),
    },
    {
      key: "team",
      header: "Team / Department",
      width: "20%",
      render: (row) => (
        <div>
          <span style={{ fontWeight: 600, fontSize: "12px", color: "#4f46e5" }}>{row.team}</span>
          <span style={{ fontSize: "11px", color: "var(--slate-500, #64748b)", display: "block" }}>
            {row.department}
          </span>
        </div>
      ),
    },
    {
      key: "assigned",
      header: "Assigned / Completed",
      width: "15%",
      render: (row) => (
        <span style={{ fontSize: "12px", fontWeight: 700 }}>
          {row.completed} / {row.totalAssigned}
        </span>
      ),
    },
    {
      key: "rework",
      header: "Rework Count",
      width: "12%",
      render: (row) => (
        <span style={{ fontSize: "12px", fontWeight: 600, color: row.reworkCount > 0 ? "#d97706" : "#64748b" }}>
          {row.reworkCount}
        </span>
      ),
    },
    {
      key: "completion",
      header: "Completion Rate",
      width: "14%",
      render: (row) => (
        <span style={{ fontWeight: 800, fontSize: "13px", color: row.completionPercentage >= 70 ? "#059669" : "#2563eb" }}>
          {row.completionPercentage}%
        </span>
      ),
    },
    {
      key: "onTime",
      header: "On-Time Rate",
      width: "14%",
      render: (row) => (
        <span style={{ fontWeight: 800, fontSize: "13px", color: row.onTimePercentage >= 80 ? "#059669" : "#d97706" }}>
          {row.onTimePercentage}%
        </span>
      ),
    },
  ];

  // Team Report Columns
  const teamColumns = [
    {
      key: "team",
      header: "Team",
      width: "25%",
      render: (row) => <strong style={{ fontSize: "13px", color: "#4f46e5" }}>{row.team}</strong>,
    },
    {
      key: "candidates",
      header: "Headcount",
      width: "15%",
      render: (row) => <span>{row.totalCandidates} candidates</span>,
    },
    {
      key: "tasks",
      header: "Total Tasks",
      width: "20%",
      render: (row) => (
        <div>
          <strong style={{ fontSize: "13px" }}>{row.totalTasks}</strong>
          <span style={{ fontSize: "11px", color: "var(--slate-500, #64748b)", display: "block" }}>
            {row.completed} completed &bull; {row.overdue} overdue
          </span>
        </div>
      ),
    },
    {
      key: "completion",
      header: "Completion Rate",
      width: "20%",
      render: (row) => (
        <div className="tm-progress-wrapper">
          <div className="tm-progress-track">
            <div
              className="tm-progress-fill"
              style={{
                width: `${row.averageCompletionPercentage}%`,
                backgroundColor: row.averageCompletionPercentage >= 75 ? "#10b981" : "#4f46e5",
              }}
            />
          </div>
          <span className="tm-progress-text">{row.averageCompletionPercentage}%</span>
        </div>
      ),
    },
    {
      key: "onTime",
      header: "On-Time Delivery",
      width: "20%",
      render: (row) => (
        <span style={{ fontWeight: 800, color: "#059669", fontSize: "13px" }}>
          {row.onTimePercentage}%
        </span>
      ),
    },
  ];

  // Task Report Columns
  const taskColumns = [
    {
      key: "task",
      header: "Task",
      width: "30%",
      render: (row) => (
        <div>
          <strong style={{ fontSize: "13px", color: "var(--slate-900, #0f172a)", display: "block" }}>
            {row.taskTitle}
          </strong>
          <span className={`tm-badge tm-priority-${row.priority?.toLowerCase()}`} style={{ fontSize: "10px", marginTop: 4 }}>
            {row.priority}
          </span>
        </div>
      ),
    },
    {
      key: "candidate",
      header: "Candidate & Team",
      width: "20%",
      render: (row) => (
        <div>
          <strong style={{ fontSize: "13px" }}>{row.candidateName}</strong>
          <span style={{ fontSize: "11px", color: "var(--slate-500, #64748b)", display: "block" }}>
            {row.candidateTeam}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "15%",
      render: (row) => {
        const s = row.status?.toLowerCase().replace("_", "-");
        return <span className={`tm-badge tm-badge-${s}`}>{row.status}</span>;
      },
    },
    {
      key: "deadline",
      header: "Deadline",
      width: "15%",
      render: (row) => (
        <div>
          <span style={{ fontSize: "12px" }}>{row.deadline ? new Date(row.deadline).toLocaleDateString() : "-"}</span>
          {row.isOverdue && (
            <span className="tm-badge tm-badge-overdue" style={{ marginLeft: 6 }}>
              OVERDUE
            </span>
          )}
        </div>
      ),
    },
    {
      key: "review",
      header: "Latest Review",
      width: "20%",
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
            <span style={{ fontSize: "11px", color: "var(--slate-500, #64748b)", display: "block" }}>
              {row.latestReviewComments.slice(0, 50)}...
            </span>
          )}
        </div>
      ),
    },
  ];

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeTab === "candidates") {
      headers = ["Candidate Name", "Email", "Team", "Department", "Total Assigned", "Completed", "Completion %", "On-Time %", "Rework Count"];
      rows = candidateReport.map((c) => [
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.team}"`,
        `"${c.department}"`,
        c.totalAssigned,
        c.completed,
        `${c.completionPercentage}%`,
        `${c.onTimePercentage}%`,
        c.reworkCount,
      ]);
    } else if (activeTab === "teams") {
      headers = ["Team Name", "Candidates", "Total Tasks", "Completed", "Overdue", "Completion %", "On-Time %"];
      rows = teamReport.map((t) => [
        `"${t.team}"`,
        t.totalCandidates,
        t.totalTasks,
        t.completed,
        t.overdue,
        `${t.averageCompletionPercentage}%`,
        `${t.onTimePercentage}%`,
      ]);
    } else {
      headers = ["Task Title", "Priority", "Candidate", "Team", "Status", "Deadline", "Is Overdue", "Review Decision"];
      rows = taskReport.map((t) => [
        `"${t.taskTitle}"`,
        t.priority,
        `"${t.candidateName}"`,
        `"${t.candidateTeam}"`,
        t.status,
        t.deadline ? new Date(t.deadline).toLocaleDateString() : "",
        t.isOverdue ? "YES" : "NO",
        t.latestReviewDecision || "PENDING",
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `evaluation_report_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── CHARTS CALCULATION HELPERS ──

  // 1. Donut Chart Calculations
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

  // 2. Team Comparative Velocity Chart Calculations
  const teamVelocityData = useMemo(() => {
    if (teamReport && teamReport.length > 0) {
      return teamReport.slice(0, 5).map((t) => ({
        name: t.team || "Team",
        total: t.totalTasks || 0,
        completed: t.completed || 0,
        overdue: t.overdue || 0,
      }));
    }
    // Fallback default teams
    return [
      { name: "Team Alpha", total: 0, completed: 0, overdue: 0 },
      { name: "Team Beta", total: 0, completed: 0, overdue: 0 },
      { name: "Team Gamma", total: 0, completed: 0, overdue: 0 },
      { name: "Team Delta", total: 0, completed: 0, overdue: 0 },
    ];
  }, [teamReport]);

  const maxVelocity = useMemo(() => {
    let max = 4;
    teamVelocityData.forEach((t) => {
      if (t.total > max) max = t.total;
    });
    return Math.ceil(max * 1.2);
  }, [teamVelocityData]);

  // 3. Deadline Timeliness Chart Calculations
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

  return (
    <div className="epr-page-container">
      {/* ── Page Header ── */}
      <div className="epr-header">
        <div className="epr-header-left">
          <div className="epr-breadcrumb">
            Reports & Analytics <span>/</span> Evaluation
          </div>
          <h1 className="epr-title">Evaluation & Performance Reports</h1>
          <p className="epr-subtitle">
            Holistic reporting across candidate velocity, team health, and task completion metrics
          </p>
        </div>

        <div className="epr-header-actions">
          {/* Action Pills */}
          <button
            type="button"
            className={`epr-pill-btn ${activeTab === "candidates" ? "active" : ""}`}
            onClick={() => setActiveTab("candidates")}
          >
            <FiUsers size={15} /> Candidate Report
          </button>
          <button
            type="button"
            className={`epr-pill-btn ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            <FiLayers size={15} /> Team Report
          </button>
          <button
            type="button"
            className={`epr-pill-btn ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <FiFileText size={15} /> Task-Wise Audit Report
          </button>

          {/* Utility Buttons */}
          <button type="button" className="epr-action-btn-outline" onClick={handleExportCSV}>
            <FiDownload size={14} /> Export (.CSV)
          </button>
          <button type="button" className="epr-action-btn-primary" onClick={fetchReports}>
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Loader.Spinner size="lg" />
          <p style={{ marginTop: 12, color: "#64748b", fontSize: "0.9rem" }}>Loading performance intelligence...</p>
        </div>
      ) : activeTab === "overview" ? (
        <>
          {/* ── 4 KPI Stats Row ── */}
          <div className="epr-kpi-grid">
            {/* Card 1: Completion Efficiency */}
            <div className="epr-kpi-card">
              <div className="epr-kpi-icon-box epr-icon-emerald">
                <FiTrendingUp />
              </div>
              <div className="epr-kpi-info">
                <span className="epr-kpi-label">COMPLETION EFFICIENCY</span>
                <span className="epr-kpi-value">{kpi.completionRate || 0}%</span>
                <span className="epr-kpi-subtext">
                  {kpi.completedTasks || 0} of {kpi.totalAssignments || 0} tasks
                </span>
              </div>
            </div>

            {/* Card 2: On-Time Completion */}
            <div className="epr-kpi-card">
              <div className="epr-kpi-icon-box epr-icon-blue">
                <FiClock />
              </div>
              <div className="epr-kpi-info">
                <span className="epr-kpi-label">ON-TIME COMPLETION</span>
                <span className="epr-kpi-value">{kpi.onTimeRate || 0}%</span>
                <span className="epr-kpi-subtext">Met target deadline</span>
              </div>
            </div>

            {/* Card 3: Overdue Ratio */}
            <div className="epr-kpi-card">
              <div className="epr-kpi-icon-box epr-icon-coral">
                <FiBarChart2 />
              </div>
              <div className="epr-kpi-info">
                <span className="epr-kpi-label">OVERDUE RATIO</span>
                <span className="epr-kpi-value">{kpi.overdueTasks || 0}</span>
                <span className="epr-kpi-subtext">Active delayed tasks</span>
              </div>
            </div>

            {/* Card 4: Active Reworks */}
            <div className="epr-kpi-card">
              <div className="epr-kpi-icon-box epr-icon-amber">
                <FiRefreshCw />
              </div>
              <div className="epr-kpi-info">
                <span className="epr-kpi-label">ACTIVE REWORKS</span>
                <span className="epr-kpi-value">{kpi.reworkTasks || 0}</span>
                <span className="epr-kpi-subtext">Revision cycle</span>
              </div>
            </div>
          </div>

          {/* ── Middle Row: 3 Chart Cards ── */}
          <div className="epr-charts-grid">
            {/* Chart 1: Task Status Breakdown (Donut) */}
            <div className="epr-chart-card">
              <div className="epr-chart-header">
                <div>
                  <h3 className="epr-chart-title">Task Status Breakdown</h3>
                  <p className="epr-chart-subtitle">Distribution of all lifecycle stages</p>
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

                {/* Donut Legend */}
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

            {/* Chart 2: Team Comparative Velocity (Grouped Bars) */}
            <div className="epr-chart-card">
              <div className="epr-chart-header">
                <div>
                  <h3 className="epr-chart-title">Team Comparative Velocity</h3>
                  <p className="epr-chart-subtitle">Task workload and completions</p>
                </div>
                <div className="epr-top-legend">
                  <div className="epr-top-legend-item">
                    <span className="epr-legend-dot" style={{ backgroundColor: "#38bdf8" }} />
                    <span>Total Tasks</span>
                  </div>
                  <div className="epr-top-legend-item">
                    <span className="epr-legend-dot" style={{ backgroundColor: "#10b981" }} />
                    <span>Completed</span>
                  </div>
                  <div className="epr-top-legend-item">
                    <span className="epr-legend-dot" style={{ backgroundColor: "#ef4444" }} />
                    <span>Overdue</span>
                  </div>
                </div>
              </div>

              <div className="epr-svg-bar-container">
                <svg width="100%" height="220" viewBox="0 0 380 220" preserveAspectRatio="none">
                  {/* Grid Lines & Y-axis values */}
                  {[0, 1, 2, 3, 4].map((step) => {
                    const yVal = Math.round((maxVelocity / 4) * step);
                    const yPos = 180 - (step / 4) * 140;
                    return (
                      <g key={step}>
                        <line x1="36" y1={yPos} x2="370" y2={yPos} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <text x="24" y={yPos + 4} fontSize="10" fill="#94a3b8" textAnchor="end">
                          {yVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Grouped Bars per Team */}
                  {teamVelocityData.map((team, idx) => {
                    const groupX = 48 + idx * 80;
                    const chartH = 140;

                    const hTotal = maxVelocity > 0 ? (team.total / maxVelocity) * chartH : 0;
                    const hCompleted = maxVelocity > 0 ? (team.completed / maxVelocity) * chartH : 0;
                    const hOverdue = maxVelocity > 0 ? (team.overdue / maxVelocity) * chartH : 0;

                    return (
                      <g key={team.name}>
                        {/* Bar 1: Total */}
                        <rect
                          className="epr-bar-column"
                          x={groupX}
                          y={180 - hTotal}
                          width="12"
                          height={Math.max(hTotal, 2)}
                          rx="3"
                          fill="#38bdf8"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              visible: true,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                              title: team.name,
                              subtitle: `Total Tasks: ${team.total}`,
                            });
                          }}
                          onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, title: "", subtitle: "" })}
                        />

                        {/* Bar 2: Completed */}
                        <rect
                          className="epr-bar-column"
                          x={groupX + 15}
                          y={180 - hCompleted}
                          width="12"
                          height={Math.max(hCompleted, 2)}
                          rx="3"
                          fill="#10b981"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              visible: true,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                              title: team.name,
                              subtitle: `Completed: ${team.completed}`,
                            });
                          }}
                          onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, title: "", subtitle: "" })}
                        />

                        {/* Bar 3: Overdue */}
                        <rect
                          className="epr-bar-column"
                          x={groupX + 30}
                          y={180 - hOverdue}
                          width="12"
                          height={Math.max(hOverdue, 2)}
                          rx="3"
                          fill="#ef4444"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              visible: true,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                              title: team.name,
                              subtitle: `Overdue: ${team.overdue}`,
                            });
                          }}
                          onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, title: "", subtitle: "" })}
                        />

                        {/* X-axis Team Label */}
                        <text
                          x={groupX + 21}
                          y="202"
                          fontSize="10"
                          fontWeight="600"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          {team.name.length > 11 ? `${team.name.slice(0, 9)}..` : team.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Chart 3: Deadline Timeliness (Category Bars) */}
            <div className="epr-chart-card">
              <div className="epr-chart-header">
                <div>
                  <h3 className="epr-chart-title">Deadline Timeliness</h3>
                  <p className="epr-chart-subtitle">On-time vs delayed tasks</p>
                </div>
              </div>

              <div className="epr-svg-bar-container">
                <svg width="100%" height="220" viewBox="0 0 340 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
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

                  {/* Deadline Category Bars */}
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

          {/* ── Bottom Row: 3 Navigation Action Cards ── */}
          <div className="epr-bottom-cards-grid">
            {/* Card 1: Candidate Performance */}
            <div className="epr-nav-card">
              <div>
                <div className="epr-nav-card-top">
                  <div className="epr-nav-card-icon" style={{ color: "#4f46e5", backgroundColor: "#eef2ff" }}>
                    <FiUsers />
                  </div>
                  <div>
                    <h4 className="epr-nav-card-title">Candidate Performance</h4>
                    <p className="epr-nav-card-desc">
                      Individual candidate task load, completion rate, rework occurrences, and on-time percentages.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="epr-nav-card-btn"
                onClick={() => setActiveTab("candidates")}
              >
                <span>View Candidate Metrics</span>
                <FiArrowRight size={14} />
              </button>
            </div>

            {/* Card 2: Team Performance */}
            <div className="epr-nav-card">
              <div>
                <div className="epr-nav-card-top">
                  <div className="epr-nav-card-icon" style={{ color: "#059669", backgroundColor: "#ecfdf5" }}>
                    <FiLayers />
                  </div>
                  <div>
                    <h4 className="epr-nav-card-title">Team Performance</h4>
                    <p className="epr-nav-card-desc">
                      Cross-team velocity comparison, average completion percentage, and overdue task count.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="epr-nav-card-btn"
                onClick={() => setActiveTab("teams")}
              >
                <span>View Team Analytics</span>
                <FiArrowRight size={14} />
              </button>
            </div>

            {/* Card 3: Task-Wise Detailed Log */}
            <div className="epr-nav-card">
              <div>
                <div className="epr-nav-card-top">
                  <div className="epr-nav-card-icon" style={{ color: "#0284c7", backgroundColor: "#f0f9ff" }}>
                    <FiFileText />
                  </div>
                  <div>
                    <h4 className="epr-nav-card-title">Task-Wise Detailed Log</h4>
                    <p className="epr-nav-card-desc">
                      Comprehensive auditable log with candidates, priorities, deadlines, submission timestamps, and reviews.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="epr-nav-card-btn"
                onClick={() => setActiveTab("tasks")}
              >
                <span>View Task Log</span>
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ── Detailed Tab View (Candidates, Teams, Tasks) ── */
        <div className="epr-table-card">
          <div className="epr-drilldown-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                className="epr-back-btn"
                onClick={() => {
                  setActiveTab("overview");
                  setSearchQuery("");
                }}
              >
                <FiArrowLeft size={14} /> Back to Overview
              </button>

              <div className="epr-drilldown-tabs">
                <button
                  type="button"
                  className={`epr-pill-btn ${activeTab === "candidates" ? "active" : ""}`}
                  onClick={() => setActiveTab("candidates")}
                >
                  Candidate Breakdown ({candidateReport.length})
                </button>
                <button
                  type="button"
                  className={`epr-pill-btn ${activeTab === "teams" ? "active" : ""}`}
                  onClick={() => setActiveTab("teams")}
                >
                  Team Performance ({teamReport.length})
                </button>
                <button
                  type="button"
                  className={`epr-pill-btn ${activeTab === "tasks" ? "active" : ""}`}
                  onClick={() => setActiveTab("tasks")}
                >
                  Task Audit Roster ({taskReport.length})
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="epr-search-wrapper">
                <FiSearch className="epr-search-icon" />
                <input
                  type="text"
                  className="epr-search-input"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button type="button" className="epr-action-btn-outline" onClick={handleExportCSV}>
                <FiDownload size={14} /> Export CSV
              </button>
            </div>
          </div>

          {activeTab === "candidates" ? (
            <Card title="Candidate Performance Benchmarks">
              <Table
                columns={candidateColumns}
                data={filteredCandidates}
                loading={false}
                emptyText="No candidate performance records match your criteria."
              />
            </Card>
          ) : activeTab === "teams" ? (
            <Card title="Team Velocity Comparison">
              <Table
                columns={teamColumns}
                data={filteredTeams}
                loading={false}
                emptyText="No team performance records match your criteria."
              />
            </Card>
          ) : (
            <Card title="Complete Task Audit Roster">
              <Table
                columns={taskColumns}
                data={filteredTasks}
                loading={false}
                emptyText="No tasks match your criteria."
              />
            </Card>
          )}
        </div>
      )}

      {/* Floating Tooltip Element */}
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