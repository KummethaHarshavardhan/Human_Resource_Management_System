import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page profile-page">

      <div className="profile-card">

        {/* Top Section */}
        <div className="profile-header">

          {/* Profile Avatar */}
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "V"}
          </div>

          {/* User Details */}
          <div className="profile-info">
            <h1>{user?.name || "Vamsi"}</h1>
            <p>{user?.email || "vamsi@company.com"}</p>
            <p>{user?.role || "admin"}</p>
          </div>

        </div>


        {/* Details */}
        <div className="profile-details">

          <div>
            <span>Name</span>
            <strong>{user?.name || "N/A"}</strong>
          </div>

          <div>
            <span>Role</span>
            <strong>{user?.role || "N/A"}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user?.email || "N/A"}</strong>
          </div>

          <div>
            <span>Department</span>
            <strong>{user?.department || "N/A"}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{user?.phone || "N/A"}</strong>
          </div>

          <div>
            <span>Joined</span>
            <strong>{user?.joinedDate || "Not available"}</strong>
          </div>

        </div>


        
      </div>

    </div>
  );
}