import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import './Profile.css';

function Profile() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'danger'
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getProfile();
      if (res.data.success) {
        const { name, email } = res.data.data;
        setProfileData({ name, email });
      }
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess('');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      return showError('Name and email are required.');
    }
    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      return showError('Please enter a valid email.');
    }
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({ name: profileData.name, email: profileData.email });
      if (res.data.success) {
        // Update AuthContext with new name/email
        const updatedUser = { ...user, name: profileData.name, email: profileData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showSuccess('Profile updated successfully!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!passwordData.password) return showError('Please enter a new password.');
    if (passwordData.password.length < 6) return showError('Password must be at least 6 characters.');
    if (passwordData.password !== passwordData.confirmPassword) return showError('Passwords do not match.');
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({ password: passwordData.password });
      if (res.data.success) {
        setPasswordData({ password: '', confirmPassword: '' });
        showSuccess('Password changed successfully!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) {
      return showError('Email does not match. Please type your email to confirm.');
    }
    setDeleting(true);
    try {
      await userAPI.deleteAccount(user.id);
      logout();
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* ── Left sidebar ── */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <div className="profile-avatar__circle">
              {getInitials(profileData.name)}
            </div>
            <h2 className="profile-avatar__name">{profileData.name}</h2>
            <p className="profile-avatar__email">{profileData.email}</p>
            <span className="profile-avatar__role">Customer</span>
          </div>

          <nav className="profile-nav">
            <button
              className={`profile-nav__btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
            >
              <span>👤</span> My Profile
            </button>
            <button
              className={`profile-nav__btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
            >
              <span>🔒</span> Change Password
            </button>
            <button
              className={`profile-nav__btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => navigate('/orders')}
            >
              <span>📦</span> My Orders
            </button>
            <button
              className={`profile-nav__btn profile-nav__btn--danger ${activeTab === 'danger' ? 'active' : ''}`}
              onClick={() => { setActiveTab('danger'); setError(''); setSuccess(''); }}
            >
              <span>🗑️</span> Delete Account
            </button>
          </nav>
        </aside>

        {/* ── Right content ── */}
        <main className="profile-main">

          {/* Alerts */}
          {success && <div className="profile-alert profile-alert--success">✓ {success}</div>}
          {error   && <div className="profile-alert profile-alert--error">✕ {error}</div>}

          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-section__header">
                <h2>My Profile</h2>
                <p>Update your personal information</p>
              </div>
              <form onSubmit={handleProfileSave} className="profile-form">
                <div className="profile-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="profile-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="profile-field profile-field--readonly">
                  <label>Account Role</label>
                  <input type="text" value="Customer" readOnly />
                </div>
                <button type="submit" className="profile-btn profile-btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* ── Password tab ── */}
          {activeTab === 'password' && (
            <div className="profile-section">
              <div className="profile-section__header">
                <h2>Change Password</h2>
                <p>Choose a strong password with at least 6 characters</p>
              </div>
              <form onSubmit={handlePasswordSave} className="profile-form">
                <div className="profile-field">
                  <label>New Password *</label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={e => setPasswordData(p => ({ ...p, password: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="profile-field">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
                {/* Password strength indicator */}
                {passwordData.password && (
                  <div className="profile-strength">
                    <div className={`profile-strength__bar ${
                      passwordData.password.length >= 10 ? 'strong' :
                      passwordData.password.length >= 6  ? 'medium' : 'weak'
                    }`} />
                    <span className="profile-strength__label">
                      {passwordData.password.length >= 10 ? 'Strong' :
                       passwordData.password.length >= 6  ? 'Medium' : 'Too short'}
                    </span>
                  </div>
                )}
                <button type="submit" className="profile-btn profile-btn--primary" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* ── Danger zone tab ── */}
          {activeTab === 'danger' && (
            <div className="profile-section">
              <div className="profile-section__header profile-section__header--danger">
                <h2>Delete Account</h2>
                <p>This action is permanent and cannot be undone. All your orders and data will be deleted.</p>
              </div>

              <div className="profile-danger-box">
                <div className="profile-danger-warning">
                  ⚠️ <strong>Warning:</strong> Deleting your account will permanently remove all your personal data, order history, and reviews.
                </div>

                <div className="profile-field">
                  <label>Type your email <strong>{profileData.email}</strong> to confirm</label>
                  <input
                    type="email"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder={profileData.email}
                  />
                </div>

                <button
                  className="profile-btn profile-btn--delete"
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirm !== profileData.email}
                >
                  {deleting ? 'Deleting...' : '🗑️ Permanently Delete Account'}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Profile;
