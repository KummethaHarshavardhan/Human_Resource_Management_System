import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Import existing API service functions
import { getAllEmployees } from '../../services/employeeService.js';
import { getDepartments } from '../../services/departmentService.js';
import { getTodayAttendance, getAttendanceHistory } from '../../services/attendanceService.js';
import { getLeaveHistory } from '../../services/leaveService.js';
import { getMyLeaveBalance } from '../../services/leaveBalanceService.js';

// Import reusable components
import Button from '../../components/Button/Button.jsx';
import Card from '../../components/Card/Card.jsx';
import Table from '../../components/Table/Table.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import './Dashboard.css';

// Helper to format time string/date cleanly (e.g. 09:08 AM)
function formatTime(dateVal) {
  if (!dateVal) return '-';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return '-';
  }
}

// Helper to format working hours decimal to hours & minutes
function formatWorkingHours(hours) {
  if (hours === undefined || hours === null || hours === '') return '-';
  const num = Number(hours);
  if (isNaN(num) || num <= 0) return '-';
  const totalMins = Math.round(num * 60);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hrs} hrs ${mins} mins`;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Real Data States
  const [employees, setEmployees] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(null);
  
  const [departments, setDepartments] = useState([]);
  const [departmentCount, setDepartmentCount] = useState(null);

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);

  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);

  const handleProfile = () => {
    navigate('/profile');
  };

  // Quick Navigation handlers
  const handleNavEmployee = () => navigate('/employee');
  const handleNavAttendance = () => navigate('/attendance-dashboard');
  const handleNavLeave = () => navigate('/leave');
  const handleNavPayroll = () => navigate('/payroll');
  const handleNavReports = () => navigate('/reports');

  // Create department map for mapping employee.departmentId -> Department Name
  const departmentMap = useMemo(() => {
    const map = {};
    if (Array.isArray(departments)) {
      departments.forEach((d) => {
        const id = d._id || d.id;
        const name = d.departmentName || d.name || d.department_name;
        if (id && name) {
          map[id] = name;
        }
      });
    }
    return map;
  }, [departments]);

  // Fetch real data from existing backend APIs
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      setApiError('');

      try {
        // Fetch Departments Data first for mapping
        try {
          const deptRes = await getDepartments();
          if (isMounted) {
            const deptList = Array.isArray(deptRes)
              ? deptRes
              : deptRes?.departments || deptRes?.data || [];
            setDepartments(deptList);
            setDepartmentCount(deptList.length);
          }
        } catch (err) {
          console.warn('Departments API warning:', err.message);
        }

        // Fetch Employees Data
        try {
          const empRes = await getAllEmployees({ limit: 100 });
          if (isMounted) {
            const empList = Array.isArray(empRes)
              ? empRes
              : empRes?.employees || empRes?.data || [];
            const count = empRes?.totalCount || empRes?.total || empList.length;
            setEmployees(empList);
            setEmployeeCount(count);
          }
        } catch (err) {
          console.warn('Employees API warning:', err.message);
        }

        // Fetch Attendance Data
        try {
          const attToday = await getTodayAttendance();
          const attHist = await getAttendanceHistory();
          if (isMounted) {
            const todayData = attToday?.attendance || attToday?.data || attToday;
            setTodayAttendance(todayData && (todayData._id || todayData.checkIn || todayData.checkInTime || todayData.status) ? todayData : null);

            const histList = Array.isArray(attHist)
              ? attHist
              : attHist?.history || attHist?.attendance || attHist?.data || [];
            setAttendanceHistory(histList);
          }
        } catch (err) {
          console.warn('Attendance API warning:', err.message);
        }

        // Fetch Leave Data
        try {
          const leaveRes = await getLeaveHistory();
          if (isMounted) {
            const leaveList = Array.isArray(leaveRes)
              ? leaveRes
              : leaveRes?.history || leaveRes?.leaves || leaveRes?.data || [];
            setLeaveHistory(leaveList);
            const pending = leaveList.filter(
              (l) => l.status?.toLowerCase() === 'pending'
            ).length;
            setPendingLeaveCount(pending);
          }
        } catch (err) {
          console.warn('Leave API warning:', err.message);
        }

        // Fetch Leave Balance Data
        try {
          const balanceRes = await getMyLeaveBalance();
          if (isMounted) {
            setLeaveBalance(balanceRes?.leaveBalance || balanceRes?.data || balanceRes);
          }
        } catch (err) {
          console.warn('Leave balance API warning:', err.message);
        }
      } catch (err) {
        if (isMounted) {
          setApiError(err.message || 'Error loading dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Columns for Workforce Directory Overview Table
  // width prop is required so both the sticky thead table and the scrollable tbody table
  // have identical column widths and headers stay aligned
  const employeeColumns = [
    {
      key: 'name',
      header: 'Employee Name',
      width: '38%',
      render: (row) => {
        const empName =
          row.user_id?.name ||
          row.name ||
          (row.firstName ? `${row.firstName} ${row.lastName || ''}`.trim() : null) ||
          '-';
        const empEmail = row.user_id?.email || row.email || '-';
        const initials = empName !== '-' ? empName.slice(0, 2).toUpperCase() : 'E';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="activity-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{empName}</strong>
              <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{empEmail}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'department',
      header: 'Department',
      width: '22%',
      render: (row) => {
        const deptObj = row.department_id || row.department;
        if (typeof deptObj === 'object' && deptObj !== null) {
          return deptObj.departmentName || deptObj.name || deptObj.department_name || '-';
        }
        const deptId = row.department_id || row.departmentId || row.department;
        return departmentMap[deptId] || (typeof deptId === 'string' && !deptId.startsWith('6') ? deptId : '-');
      }
    },
    {
      key: 'role',
      header: 'Role',
      width: '22%',
      render: (row) => {
        const roleObj = row.role_id || row.role;
        if (typeof roleObj === 'object' && roleObj !== null) {
          return roleObj.roleName || roleObj.name || '-';
        }
        return row.designation || row.role || row.user_id?.role || '-';
      }
    },
    {
      key: 'status',
      header: 'Status',
      width: '18%',
      render: (row) => {
        const st = row.employment_status || row.status || 'Active';
        const isActive = st.toLowerCase() === 'active';
        return (
          <span className={`status-badge ${isActive ? 'status-badge-active' : 'status-badge-leave'}`}>
            ● {st}
          </span>
        );
      }
    }
  ];

  const checkInTimeStr = formatTime(todayAttendance?.checkIn || todayAttendance?.checkInTime);
  const checkOutTimeStr = formatTime(todayAttendance?.checkOut || todayAttendance?.checkOutTime);
  const workingHoursStr = formatWorkingHours(todayAttendance?.workingHours);

  return (
    <div className="dashboard-page">
      {apiError && (
        <div className="notification-item notification-item-warning" style={{ marginBottom: '20px' }}>
          <div className="notification-content">
            <p>⚠️ System Notice</p>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* 1. Statistics Summary Grid */}
      <div className="stats-grid">
        <div className="stat-card-custom">
          <div className="stat-icon-wrapper stat-icon-blue">👥</div>
          <div className="stat-details">
            <p>Total Employees</p>
            {loading ? (
              <Loader.Spinner size="sm" />
            ) : employeeCount !== null ? (
              <h2>{employeeCount}</h2>
            ) : (
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>-</span>
            )}
            <span className="stat-trend stat-trend-up">
              {employeeCount !== null ? `✓ ${employees.length} records loaded` : 'Real-time API'}
            </span>
          </div>
        </div>

        <div className="stat-card-custom">
          <div className="stat-icon-wrapper stat-icon-green">🕒</div>
          <div className="stat-details">
            <p>Today's Attendance Status</p>
            {loading ? (
              <Loader.Spinner size="sm" />
            ) : todayAttendance ? (
              <h2 style={{ fontSize: '20px' }}>
                {todayAttendance.status || 'Present'}
              </h2>
            ) : (
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                No attendance recorded today
              </span>
            )}
            <span className="stat-trend stat-trend-up">
              {todayAttendance ? `Check In: ${checkInTimeStr}` : 'Real-time Log'}
            </span>
          </div>
        </div>

        <div className="stat-card-custom">
          <div className="stat-icon-wrapper stat-icon-amber">🏖️</div>
          <div className="stat-details">
            <p>Pending Leave Requests</p>
            {loading ? (
              <Loader.Spinner size="sm" />
            ) : pendingLeaveCount !== null ? (
              <h2>{pendingLeaveCount}</h2>
            ) : (
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>-</span>
            )}
            <span className="stat-trend stat-trend-neutral">
              {leaveHistory ? `Total ${leaveHistory.length} applications` : 'Leave API'}
            </span>
          </div>
        </div>

        <div className="stat-card-custom">
          <div className="stat-icon-wrapper stat-icon-purple">🏢</div>
          <div className="stat-details">
            <p>Total Departments</p>
            {loading ? (
              <Loader.Spinner size="sm" />
            ) : departmentCount !== null ? (
              <h2>{departmentCount}</h2>
            ) : (
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>-</span>
            )}
            <span className="stat-trend stat-trend-up">
              {departmentCount !== null ? `✓ ${departments.length} active units` : 'Department API'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Quick Actions & Real Workforce Table */}
        <div className="dashboard-main-column">
          {/* Quick Actions Grid */}
          <Card title="⚡ Quick HR Actions" subtitle="Fast access to essential workforce modules">
            <div className="quick-actions-grid">
              <button type="button" className="quick-action-item" onClick={handleNavEmployee}>
                <span className="quick-action-icon">📁</span>
                <span className="quick-action-text">
                  <span className="quick-action-title">Directory</span>
                  <span className="quick-action-desc">View employees</span>
                </span>
              </button>

              <button type="button" className="quick-action-item" onClick={handleNavAttendance}>
                <span className="quick-action-icon">⏰</span>
                <span className="quick-action-text">
                  <span className="quick-action-title">Attendance</span>
                  <span className="quick-action-desc">Check-in & history</span>
                </span>
              </button>

              <button type="button" className="quick-action-item" onClick={handleNavLeave}>
                <span className="quick-action-icon">📅</span>
                <span className="quick-action-text">
                  <span className="quick-action-title">Leave Management</span>
                  <span className="quick-action-desc">Review requests</span>
                </span>
              </button>

              <button type="button" className="quick-action-item" onClick={handleNavPayroll}>
                <span className="quick-action-icon">💰</span>
                <span className="quick-action-text">
                  <span className="quick-action-title">Payroll</span>
                  <span className="quick-action-desc">Salary & slips</span>
                </span>
              </button>

              <button type="button" className="quick-action-item" onClick={handleNavReports}>
                <span className="quick-action-icon">📊</span>
                <span className="quick-action-text">
                  <span className="quick-action-title">Reports</span>
                  <span className="quick-action-desc">HR analytics</span>
                </span>
              </button>

              <button type="button" className="quick-action-item" onClick={handleProfile}>
                <span className="quick-action-icon">⚙️</span>
                <span className="quick-action-text">
                  <span className="quick-action-title">Settings</span>
                  <span className="quick-action-desc">My Account</span>
                </span>
              </button>
            </div>
          </Card>

          {/* Real Workforce Directory Overview Table */}
          <Card
            title="📁 Real Workforce Directory"
            subtitle="Live employee data from backend API"
            action={
              <Button variant="outline" size="sm" onClick={handleNavEmployee}>
                Manage Directory
              </Button>
            }
          >
            <Table
              columns={employeeColumns}
              data={employees}
              loading={loading}
              emptyText="No employee records found in system database."
              maxHeight="380px"
            />
          </Card>
        </div>

        {/* Right Column: Attendance Status & Real Leave Overview */}
        <div className="dashboard-side-column">
          {/* Today's Attendance Card */}
          <Card title="⏰ Today's Attendance Record" subtitle="Real-time check-in status">
            {loading ? (
              <Loader.Skeleton rows={3} />
            ) : !todayAttendance ? (
              <div className="hrms-table-empty" style={{ padding: '24px 16px' }}>
                <span style={{ fontSize: '2rem' }}>🕒</span>
                <span className="hrms-table-empty-text" style={{ fontWeight: 600, color: '#475569' }}>
                  No attendance recorded today
                </span>
              </div>
            ) : (
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-details">
                    <strong>Check In Time</strong>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {checkInTimeStr}
                    </p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-details">
                    <strong>Check Out Time</strong>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {checkOutTimeStr}
                    </p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-details">
                    <strong>Status</strong>
                    <p>
                      <span className="status-badge status-badge-active">
                        ● {todayAttendance.status || 'Present'}
                      </span>
                    </p>
                  </div>
                </div>

                {workingHoursStr !== '-' && (
                  <div className="activity-item">
                    <div className="activity-details">
                      <strong>Working Hours</strong>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                        {workingHoursStr}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Real Leave History Card */}
          <Card title="📅 Leave Applications" subtitle="Real data from Leave API">
            {loading ? (
              <Loader.Skeleton rows={3} />
            ) : leaveHistory.length === 0 ? (
              <div className="hrms-table-empty" style={{ padding: '20px' }}>
                <span style={{ fontSize: '1.5rem' }}>📑</span>
                <span className="hrms-table-empty-text">No leave history records found.</span>
              </div>
            ) : (
              <div className="activity-list">
                {leaveHistory.slice(0, 4).map((item, idx) => (
                  <div key={item._id || item.id || idx} className="activity-item">
                    <div className="activity-avatar">
                      {(item.leaveType || item.type || 'L').charAt(0).toUpperCase()}
                    </div>
                    <div className="activity-details">
                      <strong>{item.leaveType || item.type || 'Leave Request'}</strong>
                      <p>
                        {item.reason || item.description || `Status: ${item.status || 'Pending'}`}
                      </p>
                    </div>
                    <span className="activity-time">
                      <span className={`status-badge ${item.status?.toLowerCase() === 'approved' ? 'status-badge-active' : 'status-badge-leave'}`}>
                        {item.status || 'Pending'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={isAnnounceModalOpen}
        onClose={() => setIsAnnounceModalOpen(false)}
        title="ℹ️ System Information"
        size="md"
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsAnnounceModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div>
          <h4>HRMS Backend Integration</h4>
          <p>This dashboard displays real-time backend API data.</p>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
