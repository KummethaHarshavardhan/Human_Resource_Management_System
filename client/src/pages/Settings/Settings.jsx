import "../../styles/settings.css";

import { FaSave } from "react-icons/fa";

const Settings = () => {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <h2>Settings</h2>
        <button className="save-btn">
          <FaSave />
          Save Changes
        </button>
      </div>

      <div className="settings-container">

        <div className="settings-card">

          <h3>Appearance</h3>

          <div className="setting-item">
            <label>Theme</label>

            <select>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

        </div>

        <div className="settings-card">

          <h3>Notifications</h3>

          <div className="setting-item">

            <label>Email Notifications</label>

            <input type="checkbox" defaultChecked />

          </div>

          <div className="setting-item">

            <label>SMS Notifications</label>

            <input type="checkbox" />

          </div>

        </div>

        <div className="settings-card">

          <h3>Account</h3>

          <div className="setting-item">

            <label>Language</label>

            <select>
              <option>English</option>
              <option>Telugu</option>
              <option>Hindi</option>
            </select>

          </div>

          <div className="setting-item">

            <label>Change Password</label>

            <button className="change-btn">
              Change Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;