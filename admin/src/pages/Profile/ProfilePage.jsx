import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { token, admin } = useContext(StoreContext);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Assuming the backend URL is localhost:4000, adjust if needed
  const url = 'http://localhost:4000';

  useEffect(() => {
    if (token && admin) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token, admin]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: { token },
      });
      if (response.data.success) {
        setProfile({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } else {
        setMessage('Failed to load profile');
      }
    } catch (error) {
      setMessage('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!profile.name.trim()) {
      setMessage('Name cannot be empty');
      return;
    }
    setUpdating(true);
    try {
      const response = await axios.post(`${url}/api/user/update`, {
        name: profile.name,
      }, {
        headers: { token },
      });
      if (response.data.success) {
        setMessage('Profile updated successfully');
        // Optionally refetch or update local state
      } else {
        setMessage(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (!admin) {
    return <div className="profile-page">Access denied. Admin only.</div>;
  }

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile">
      <form className="flex-col">
        <div className="profile-name flex-col">
          <p>Name</p>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Type here"
            required
          />
        </div>
        <div className="profile-email flex-col">
          <p>Email</p>
          <input
            type="email"
            value={profile.email}
            readOnly
          />
        </div>
        <button type="button" onClick={handleUpdate} disabled={updating} className="profile-btn">
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
