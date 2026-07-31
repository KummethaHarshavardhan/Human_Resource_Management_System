import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  }, []);

  const userName = user?.name || user?.email || 'Team Member';

  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const stats = [
    { label: 'Total Employees', value: '128', note: '+5 this week' },
    { label: 'Present Today', value: '112', note: '88% attendance' },
    { label: 'Pending Requests', value: '14', note: '2 new approvals' },
    { label: 'Payroll Due', value: '$74k', note: 'Due in 3 days' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {userName}</h1>
          <p>Your HR dashboard is ready for review.</p>
        </div>
        <div>
          <div className="dashboard-date">{formattedDate}</div>
          <button onClick={handleProfile} className="view-all" style={{ marginTop: '14px', marginRight: '12px' }}>
            Profile
          </button>
          <button onClick={handleLogout} className="view-all" style={{ marginTop: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">★</div>
            <div>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
              <span>{stat.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Attendance Overview</h2>
            <p>Last 7 days</p>
          </div>
          <div className="attendance-bars">
            <div className="bar-item">
              <span>Mon</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: '80%' }} />
              </div>
              <strong>80%</strong>
            </div>
            <div className="bar-item">
              <span>Tue</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: '92%' }} />
              </div>
              <strong>92%</strong>
            </div>
            <div className="bar-item">
              <span>Wed</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: '68%' }} />
              </div>
              <strong>68%</strong>
            </div>
            <div className="bar-item">
              <span>Thu</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: '88%' }} />
              </div>
              <strong>88%</strong>
            </div>
            <div className="bar-item">
              <span>Fri</span>
              <div className="bar">
                <div className="bar-fill" style={{ width: '96%' }} />
              </div>
              <strong>96%</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
            <p>Common HR workflows</p>
          </div>
          <div className="quick-actions">
            <button>Approve Leave</button>
            <button>Review Payslips</button>
            <button>View Attendance</button>
            <button>Manage Employees</button>
          </div>
        </div>
      </div>

      <div className="dashboard-card recent-card">
        <div className="card-header">
          <h2>Recent Activity</h2>
          <button className="view-all">View all</button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-avatar">AR</div>
            <div>
              <strong>Aisha Roy</strong>
              <p>Submitted leave request for next week.</p>
            </div>
            <span>2h ago</span>
          </div>
          <div className="activity-item">
            <div className="activity-avatar">TN</div>
            <div>
              <strong>Tom Nguyen</strong>
              <p>Completed performance review.</p>
            </div>
            <span>5h ago</span>
          </div>
          <div className="activity-item">
            <div className="activity-avatar">LS</div>
            <div>
              <strong>Lina Smith</strong>
              <p>Updated profile details.</p>
            </div>
            <span>1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;