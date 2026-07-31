import "../../styles/profile.css";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";

const Profile = () => {
  return (
    <div className="profile-page">

      <div className="profile-header">
        <h2>My Profile</h2>
        <button className="edit-btn">Edit Profile</button>
      </div>

      <div className="profile-card">

        <div className="profile-left">

          <FaUserCircle className="profile-avatar" />

          <h3>Admin User</h3>

          <p>HR Administrator</p>

        </div>

        <div className="profile-right">

          <div className="info-box">
            <FaEnvelope />
            <span>admin@hrms.com</span>
          </div>

          <div className="info-box">
            <FaPhone />
            <span>+91 9876543210</span>
          </div>

          <div className="info-box">
            <FaBuilding />
            <span>Human Resources</span>
          </div>

          <div className="info-box">
            <FaBriefcase />
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;