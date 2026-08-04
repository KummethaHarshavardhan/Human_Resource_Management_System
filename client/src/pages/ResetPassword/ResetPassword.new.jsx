import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api';
import './ResetPassword.css';
import logo from '../../assets/infinetra-logo.png';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('');

    if (!password || !confirmPassword) {
      setMessage('Please enter both password fields.');
      setStatus('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    if (!token) {
      setMessage('Reset token is missing.');
      setStatus('error');
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword({ token, password });
      setMessage(data.message || 'Password reset successful.');
      setStatus('success');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 1400);
    } catch (error) {
      setMessage(error.message || 'Failed to reset password.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-section">
          <img src={logo} alt="Infinetra Logo" className="logo-image" />
          <h1>Infinetra HRMS</h1>
          <p className="brand-description">
            Elevating enterprise productivity through intelligent employee management and seamless human resource workflows.
          </p>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <svg
              className="feature-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <h4>Unified Dashboard</h4>
            <p>Real-time metrics at your fingertips.</p>
          </div>
          <div className="feature-card">
            <svg
              className="feature-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L20 6V12C20 17 16.5 20 12 22C7.5 20 4 17 4 12V6L12 2Z" />
              <path d="M8.5 12L11 14.5L15.5 10" />
            </svg>
            <h4>Secure Access</h4>
            <p>Enterprise-grade data protection.</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <div className="theme-icon">☾</div>
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your new password and confirm it to complete the reset.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <div className="password-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {message && (
            <div className={`status-message ${status === 'success' ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="page-footer">
            <Link to="/login" className="link">
              Back to Login
            </Link>
          </div>

          <p className="powered-by">POWERED BY INFINETRA TECH</p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;