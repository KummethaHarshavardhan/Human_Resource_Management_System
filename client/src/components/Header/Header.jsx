import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import NotificationBell from '../Notifications/NotificationBell.jsx';
import Button from '../Button/Button.jsx';
import './Header.css';

/**
 * Enterprise Fixed Welcome Header Component
 * Features clean 3-line hamburger icon (FaBars), fixed positioning, user avatar, profile & logout.
 */
const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.name || user?.email || 'Team Member';
  const userRole = user?.role || 'Employee';
  const userInitials = userName
    ? userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'HR';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="app-fixed-header">
      <div className="header-left">
        <div className="header-user-group">
          <div className="header-user-avatar">{userInitials}</div>
          <div className="header-title-box">
            <h1 className="header-welcome-title">Welcome back, {userName}!</h1>
            <span className="header-role-badge">Role: {userRole}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <NotificationBell />
        <Button variant="outline" size="sm" onClick={handleProfile} icon="👤">
          Profile
        </Button>
        <Button variant="danger" size="sm" onClick={handleLogout} icon="🚪">
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
