import './ChangePassword.css';

function ChangePassword() {
  return (
    <div className="change-password-page">

      <div className="change-password-header">
        <h1>Change Password</h1>
        <p>Update your account password to keep your account secure.</p>
      </div>

      <div className="password-card">

        <div className="security-icon">
          🔒
        </div>

        <h2>Update Password</h2>

        <p className="password-description">
          Choose a strong password that you don't use anywhere else.
        </p>

        <form>

          <div className="password-group">
            <label>Current Password</label>

            <input
              type="password"
              placeholder="Enter current password"
            />
          </div>

          <div className="password-group">
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <div className="password-group">
            <label>Confirm New Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <div className="password-rules">
            <p>Password must contain:</p>
            <span>✓ At least 8 characters</span>
            <span>✓ One uppercase letter</span>
            <span>✓ One number</span>
            <span>✓ One special character</span>
          </div>

          <div className="password-actions">
            <button
              type="button"
              className="cancel-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-btn"
            >
              Update Password
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;