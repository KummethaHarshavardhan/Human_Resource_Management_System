import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, googleLoginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import Passkey from '../Passkey/Passkey.jsx';
import logo from '../../assets/infinetra-logo.png';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    const scriptId = 'google-identity-script';

    const initializeGoogleSignIn = () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
          console.error(
            'VITE_GOOGLE_CLIENT_ID is missing - check client/.env'
          );
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse
        });

        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = '';

          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: 300
            }
          );
        }
      }
    };

    if (document.getElementById(scriptId)) {
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');

    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;

    document.body.appendChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);

      const data = await googleLoginUser(response.credential);

      login({
        user: data.user,
        token: data.token
      });

      showToast('success', 'Google login successful');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (error) {
      console.error('Google login error:', error);

      const errorMessage =
        error?.message?.toLowerCase() || '';

      if (
        errorMessage.includes('failed to fetch') ||
        errorMessage.includes('network error') ||
        errorMessage.includes('networkerror')
      ) {
        showToast(
          'error',
          'Unable to connect to server'
        );
      } else {
        showToast(
          'error',
          error?.message || 'Google login failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    const realGoogleButton =
      googleButtonRef.current
        ? googleButtonRef.current.querySelector(
            'div[role="button"]'
          )
        : null;

    if (realGoogleButton) {
      realGoogleButton.click();
    } else {
      showToast(
        'error',
        'Google Sign-In is still loading. Please try again.'
      );
    }
  };

  const openPasskeyModal = () => {
    setShowPasskeyModal(true);
  };

  const closePasskeyModal = () => {
    setShowPasskeyModal(false);
  };

  const handlePasskeySuccess = () => {
    sessionStorage.setItem(
      'passkeyVerified',
      'true'
    );

    setShowPasskeyModal(false);

    showToast(
      'success',
      'Passkey verified'
    );

    navigate('/register');
  };

  const handleRememberMe = (checked) => {
    setRememberMe(checked);

    if (checked) {
      localStorage.setItem(
        'rememberMe',
        'true'
      );
    } else {
      localStorage.removeItem(
        'rememberMe'
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast(
        'error',
        'Please enter email and password'
      );
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: email.trim(),
        password
      });

      login({
        user: data.user,
        token: data.token
      });

      if (rememberMe) {
        localStorage.setItem(
          'rememberMe',
          'true'
        );
      } else {
        localStorage.removeItem(
          'rememberMe'
        );
      }

      showToast(
        'success',
        'Login successful'
      );

      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      const errorMessage =
        error?.message?.toLowerCase() || '';

      if (
        errorMessage.includes(
          'invalid email or password'
        ) ||
        errorMessage.includes(
          'incorrect email or password'
        )
      ) {
        showToast(
          'error',
          'Incorrect email or password'
        );
      } else if (
        errorMessage.includes(
          'failed to fetch'
        ) ||
        errorMessage.includes(
          'network error'
        ) ||
        errorMessage.includes(
          'networkerror'
        )
      ) {
        showToast(
          'error',
          'Unable to connect to server'
        );
      } else {
        showToast(
          'error',
          error?.message || 'Login failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {toast && (
        <div
          className={`login-toast ${toast.type}`}
        >
          <div className="toast-icon">
            {toast.type === 'success'
              ? '✓'
              : '✕'}
          </div>

          <div className="toast-content">
            <strong>
              {toast.type === 'success'
                ? 'Success'
                : 'Error'}
            </strong>

            <span>
              {toast.message}
            </span>
          </div>
        </div>
      )}

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
            Elevating productivity through
            intelligent employee management
            and seamless human resource
            workflows.
          </p>

          <div className="feature-cards">

            <div className="feature-card">

              <span
                className="feature-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <rect
                    x="2"
                    y="2"
                    width="6"
                    height="6"
                    rx="1"
                  />

                  <rect
                    x="12"
                    y="2"
                    width="6"
                    height="6"
                    rx="1"
                  />

                  <rect
                    x="2"
                    y="12"
                    width="6"
                    height="6"
                    rx="1"
                  />

                  <rect
                    x="12"
                    y="12"
                    width="6"
                    height="6"
                    rx="1"
                  />
                </svg>
              </span>

              <h4>
                Unified Dashboard
              </h4>

              <p>
                Real-time metrics at your
                fingertips.
              </p>

            </div>

            <div className="feature-card">

              <span
                className="feature-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    d="M10 2C7.23858 2 5 4.23858 5 7V9C4.44772 9 4 9.44772 4 10V14C4 15.6569 5.34315 17 7 17H13C14.6569 17 16 15.6569 16 14V10C16 9.44772 15.5523 9 15 9V7C15 4.23858 12.7614 2 10 2Z"
                    opacity="0.25"
                  />

                  <path
                    d="M7.75 10.75L9.5 12.5L12.75 9.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <h4>
                Secure Access
              </h4>

              <p>
                Enterprise-grade data
                protection.
              </p>

            </div>

          </div>
        </div>
      </div>

      <div className="login-right">

        <div className="login-form-box">

          <h2>
            Welcome back
          </h2>

          <p className="subtitle">
            Sign in to continue to your
            dashboard.
          </p>

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

            </div>

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <svg
                      className="eye-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 12C4.1 8.5 7.6 6 12 6C16.4 6 19.9 8.5 21.5 12C19.9 15.5 16.4 18 12 18C7.6 18 4.1 15.5 2.5 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="eye-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 12C4.1 8.5 7.6 6 12 6C16.4 6 19.9 8.5 21.5 12C19.9 15.5 16.4 18 12 18C7.6 18 4.1 15.5 2.5 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="M4 4L20 20"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>

              </div>

            </div>

            <div className="form-row">

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) =>
                    handleRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Remember Me
                </span>

              </label>

              <Link
                to="/forgot-password"
                className="link"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Signing In...'
                : 'Sign In'}
            </button>

            <div className="divider">

              <span></span>

              <p>OR</p>

              <span></span>

            </div>

            <div
              ref={googleButtonRef}
              className="google-hidden-button"
            ></div>

            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleClick}
              disabled={loading}
            >

              <svg
                className="google-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.36l3.24-2.53Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.25 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
                />
              </svg>

              <span>
                Sign in with Google
              </span>

            </button>

          </form>

          <p className="register-text">

            New to Infinetra?{' '}

            <button
              type="button"
              className="link link-button"
              onClick={openPasskeyModal}
            >
              Register now
            </button>

          </p>

          <p className="powered-by">
            POWERED BY INFINETRA TECH
          </p>

        </div>
      </div>

      {showPasskeyModal && (
        <Passkey
          onClose={closePasskeyModal}
          onSuccess={handlePasskeySuccess}
        />
      )}

    </div>
  );
}

export default Login;