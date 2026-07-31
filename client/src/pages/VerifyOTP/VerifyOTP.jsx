import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOtpForEmail } from '../../api';
import './VerifyOTP.css';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email) {
      setMessage('Missing email. Please start from Forgot Password.');
      return;
    }
    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }

    try {
      setLoading(true);
      await verifyOtpForEmail(email, otp);
      // navigate to reset-password, pass email and otp
      navigate('/reset-password', { state: { email, otp } });
    } catch (err) {
      setMessage(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <div className="login-form-box">
          <h2>Verify OTP</h2>
          <p>Enter the OTP sent to your email address.</p>
          <p className="small">Email: {email}</p>

          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Enter 6-digit OTP</label>
              <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="______" />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>

          {message && <div className="status-message error">{message}</div>}

          <div className="page-footer">
            <Link to="/forgot-password" className="link">Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;