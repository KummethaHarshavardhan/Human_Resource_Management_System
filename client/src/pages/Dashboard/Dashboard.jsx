
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.name || user?.email || 'Team Member';

  const handleLogout = () => {
    logout();
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
          <button onClick={handleProfile} className="view-all" style={{ marginTop: '14px', marginRight: '12px' }}>
            Profile
          </button>
          <button onClick={handleLogout} className="view-all" style={{ marginTop: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-intro-card">
        <h2>Dashboard Overview</h2>
        <p>Use the sidebar to access your HR modules and manage employee data, attendance, leave, payroll, and reports.</p>
      </div>
    </div>
  );
}
export default Dashboard;


