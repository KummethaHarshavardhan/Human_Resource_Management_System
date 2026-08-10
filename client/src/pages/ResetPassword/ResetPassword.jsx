import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import './ResetPassword.css';
import logo from '../../assets/infinetra-logo.png';

/* =========================
   EYE ICON
========================= */

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.5 12C2.5 12 6 6 12 6C18 6 21.5 12 21.5 12C21.5 12 18 18 12 18C6 18 2.5 12 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle
      cx="12"
      cy="12"
      r="2.8"
      stroke="currentColor"
      strokeWidth="1.7"
    />
  </svg>
);

/* =========================
   EYE OFF ICON
   Eye + diagonal slash
========================= */

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.5 12C2.5 12 6 6 12 6C18 6 21.5 12 21.5 12C21.5 12 18 18 12 18C6 18 2.5 12 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle
      cx="12"
      cy="12"
      r="2.8"
      stroke="currentColor"
      strokeWidth="1.7"
    />

    <path
      d="M4 4L20 20"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      const data = await resetPassword({
        token,
        password
      });

      setMessage(
        data.message || 'Password reset successful.'
      );

      setStatus('success');

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1400);

    } catch (error) {
      console.error('Reset password error:', error);

      setMessage(
        error.message || 'Failed to reset password.'
      );

      setStatus('error');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* =========================
          LEFT SECTION
      ========================= */}

      <div className="login-left">

        <div className="brand-section">

          <img
            src={logo}
            alt="Infinetra Logo"
            className="logo-image"
          />

          <h1>
            Infinetra HRMS
          </h1>

          <p className="brand-description">
            Elevating enterprise productivity through intelligent employee
            management and seamless human resource workflows.
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
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
              />

              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
            </svg>

            <h4>
              Unified Dashboard
            </h4>

            <p>
              Real-time metrics at your fingertips.
            </p>

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

            <h4>
              Secure Access
            </h4>

            <p>
              Enterprise-grade data protection.
            </p>

          </div>

        </div>

      </div>

      {/* =========================
          RIGHT SECTION
      ========================= */}

      <div className="login-right">

        <div className="login-form-box">

          <div className="theme-icon">
            ☾
          </div>

          <h2>
            Reset Password
          </h2>

          <p className="subtitle">
            Enter your new password and confirm it to complete the reset.
          </p>

          <form onSubmit={handleSubmit}>

            {/* =========================
                NEW PASSWORD
            ========================= */}

            <div className="form-group">

              <label htmlFor="password">
                New Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>

              </div>

            </div>

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="password-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>

              </div>

            </div>

            {/* =========================
                RESET BUTTON
            ========================= */}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Resetting...'
                : 'Reset Password'}
            </button>

          </form>

          {/* =========================
              STATUS MESSAGE
          ========================= */}

          {message && (
            <div
              className={`status-message ${
                status === 'success'
                  ? 'success'
                  : 'error'
              }`}
            >
              {message}
            </div>
          )}

          {/* =========================
              BACK TO LOGIN
          ========================= */}

          <div className="page-footer">

            <Link
              to="/login"
              className="link"
            >
              Back to Login
            </Link>

          </div>

          <p className="powered-by">
            POWERED BY INFINETRA TECH
          </p>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;