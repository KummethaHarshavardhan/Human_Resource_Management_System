import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProfile();
        setProfile(data.user);
        setForm({ name: data.user.name, email: data.user.email });
      } catch (err) {
        setError(err.message || 'Unable to load profile.');
        if (err.message === 'Authentication required') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleEdit = () => {
    setError('');
    setSuccess('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const data = await updateProfile({ name: form.name, email: form.email });
      setProfile(data.user);
      setForm({ name: data.user.name, email: data.user.email });
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setError(err.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loader">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-loader">Unable to load profile.</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>Profile</h1>
          <p>Review and manage your account information.</p>
        </div>

        <div className="profile-actions">
          <Link to="/dashboard" className="profile-link-button">
            Back to Dashboard
          </Link>
          {!isEditing && (
            <button type="button" className="edit-profile-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && <div className="profile-alert error">{error}</div>}
      {success && <div className="profile-alert success">{success}</div>}

      <div className="profile-content">
        <div className="profile-card profile-summary">
          <div className="profile-avatar">
            {profile.name?.split(' ').map((part) => part[0]).join('').toUpperCase()}
          </div>
          <h2>{profile.name}</h2>
          <p className="profile-role">{profile.role || 'Employee'}</p>
          <p className="profile-email">{profile.email}</p>
        </div>

        <div className="profile-card profile-details">
          <h2>Personal Information</h2>

          <div className="detail-row">
            <span>Name</span>
            {isEditing ? (
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <strong>{profile.name}</strong>
            )}
          </div>

          <div className="detail-row">
            <span>Email</span>
            {isEditing ? (
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <strong>{profile.email}</strong>
            )}
          </div>

          <div className="detail-row">
            <span>Role</span>
            <strong>{profile.role || 'Employee'}</strong>
          </div>

          {isEditing && (
            <div className="edit-controls">
              <button type="button" className="btn-secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
