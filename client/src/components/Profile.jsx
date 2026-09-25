import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Save, X, Edit2, Shield, Calendar, MapPin, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        location: 'Bangalore, India',
        memberSince: 'January 2026',
        avatar: '',
        totalBookings: 0
    });

    const [tempUser, setTempUser] = useState({ ...user });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await api.getProfile();
                if (data && data.name) {
                    setUser(prev => ({ ...prev, ...data }));
                    setTempUser(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.warn('Error fetching profile from API:', err.message);
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    setUser(prev => ({ ...prev, ...parsed }));
                    setTempUser(prev => ({ ...prev, ...parsed }));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            setMsg({ text: '', type: '' });
            const updated = await api.updateProfile(tempUser);
            setUser(prev => ({ ...prev, ...updated }));
            setTempUser(prev => ({ ...prev, ...updated }));
            setIsEditing(false);
            setMsg({ text: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => setMsg({ text: '', type: '' }), 4000);
        } catch (err) {
            setMsg({ text: err.message || 'Failed to update profile', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setTempUser(user);
        setIsEditing(false);
        setMsg({ text: '', type: '' });
    };

    const handleChange = (e) => {
        setTempUser({ ...tempUser, [e.target.name]: e.target.value });
    };

    return (
        <div className="profile-page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-card-wrapper"
            >
                {/* Profile Header/Cover */}
                <div className="profile-header">
                    <div className="profile-cover-gradient"></div>
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-container">
                            <div className="profile-avatar">
                                {tempUser.avatar ? (
                                    <img src={tempUser.avatar} alt="Profile" />
                                ) : (
                                    <User size={60} />
                                )}
                            </div>
                            {isEditing && (
                                <button className="avatar-edit-btn" title="Add Image URL">
                                    <Camera size={20} />
                                </button>
                            )}
                        </div>
                        <div className="profile-basic-info">
                            <h2>{user.name}</h2>
                            <p><Shield size={14} /> Verified Premium Member</p>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    {msg.text && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            background: msg.type === 'success' ? 'rgba(82, 196, 26, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                            border: `1px solid ${msg.type === 'success' ? '#52c41a' : '#ff4d4f'}`,
                            color: msg.type === 'success' ? '#73d13d' : '#ff7875'
                        }}>
                            {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span>{msg.text}</span>
                        </div>
                    )}

                    <div className="profile-content-header">
                        <h3>Profile Information</h3>
                        {!isEditing ? (
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button className="cancel-btn" onClick={handleCancel} disabled={saving}>
                                    <X size={16} /> Cancel
                                </button>
                                <button className="save-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-details-grid">
                        <div className="detail-item">
                            <label><User size={16} /> Full Name</label>
                            {isEditing ? (
                                <input
                                    name="name"
                                    value={tempUser.name}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <p>{user.name}</p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label><Mail size={16} /> Email Address</label>
                            {isEditing ? (
                                <input
                                    name="email"
                                    value={tempUser.email}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <p>{user.email}</p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label><Phone size={16} /> Phone Number</label>
                            {isEditing ? (
                                <input
                                    name="phone"
                                    value={tempUser.phone}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <p>{user.phone}</p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label><MapPin size={16} /> Location</label>
                            {isEditing ? (
                                <input
                                    name="location"
                                    value={tempUser.location}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <p>{user.location}</p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label><Calendar size={16} /> Member Since</label>
                            <p>{user.memberSince}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics/Badges area */}
                <div className="profile-footer">
                    <div className="stat-card">
                        <span className="stat-value">{user.totalBookings || 0}</span>
                        <span className="stat-label">Total Bookings</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">4.9</span>
                        <span className="stat-label">User Rating</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{user.role === 'admin' ? 'Admin' : 'Elite'}</span>
                        <span className="stat-label">Status</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
