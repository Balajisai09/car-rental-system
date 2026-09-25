import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Car, MoreVertical, XCircle, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MyBookings.css';

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await api.getMyBookings();
            if (Array.isArray(data)) {
                setBookings(data);
            }
        } catch (error) {
            console.warn('Error fetching bookings from API:', error.message);
            // Fallback bookings if backend not reachable
            const fallback = [
                {
                    _id: 'BK-2023-001',
                    carName: 'Mahindra XUV700',
                    carImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
                    status: 'upcoming',
                    startDate: '2026-02-12',
                    startTime: '10:00 AM',
                    endDate: '2026-02-15',
                    endTime: '10:00 PM',
                    location: 'Bangalore International Airport',
                    totalPrice: 13500,
                    bookingDate: '28 Jan 2026'
                },
                {
                    _id: 'BK-2022-892',
                    carName: 'Hyundai Verna',
                    carImage: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200',
                    status: 'completed',
                    startDate: '2025-12-10',
                    startTime: '09:00 AM',
                    endDate: '2025-12-12',
                    endTime: '08:00 PM',
                    location: 'Indiranagar, Bangalore',
                    totalPrice: 5000,
                    bookingDate: '01 Dec 2025'
                },
                {
                    _id: 'BK-2022-541',
                    carName: 'Maruti Swift',
                    carImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200',
                    status: 'cancelled',
                    startDate: '2025-11-05',
                    startTime: '11:00 AM',
                    endDate: '2025-11-06',
                    endTime: '11:00 AM',
                    location: 'Koramangala, Bangalore',
                    totalPrice: 1500,
                    bookingDate: '01 Nov 2025'
                }
            ];
            setBookings(fallback);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setCancellingId(bookingId);
            await api.cancelBooking(bookingId);
            setBookings(prev =>
                prev.map(b => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
            );
        } catch (error) {
            alert(error.message || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const filteredBookings = bookings.filter(b =>
        activeTab === 'all' ? true : b.status === activeTab
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'status-blue';
            case 'completed': return 'status-green';
            case 'cancelled': return 'status-red';
            default: return 'status-gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'upcoming': return <Clock size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="bookings-page-wrapper">
            <div className="bookings-container">
                <div className="bookings-header">
                    <h1>My Bookings</h1>
                    <p>Manage your upcoming trips and view past rentals saved in the database.</p>
                </div>

                {/* Tabs */}
                <div className="bookings-tabs">
                    {['upcoming', 'completed', 'cancelled', 'all'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="bookings-list">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', gap: '0.75rem', color: '#888' }}>
                            <Loader size={24} className="animate-spin" />
                            <span>Loading your bookings...</span>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <motion.div
                                        key={booking._id || booking.id}
                                        className="booking-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        layout
                                    >
                                        <div className="booking-image">
                                            <img src={booking.carImage || booking.image} alt={booking.carName} />
                                            <span className={`booking-status-badge ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="booking-details">
                                            <div className="booking-info-header">
                                                <h3>{booking.carName}</h3>
                                                <span className="booking-id">ID: {(booking._id || booking.id).slice(-8).toUpperCase()}</span>
                                            </div>

                                            <div className="booking-meta-grid">
                                                <div className="meta-item">
                                                    <Calendar size={16} />
                                                    <div>
                                                        <span className="label">Pickup</span>
                                                        <span className="value">{booking.startDate} • {booking.startTime || '10:00 AM'}</span>
                                                    </div>
                                                </div>
                                                <div className="meta-item">
                                                    <Calendar size={16} />
                                                    <div>
                                                        <span className="label">Return</span>
                                                        <span className="value">{booking.endDate} • {booking.endTime || '10:00 PM'}</span>
                                                    </div>
                                                </div>
                                                <div className="meta-item full-width">
                                                    <MapPin size={16} />
                                                    <div>
                                                        <span className="label">Location</span>
                                                        <span className="value">{booking.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-footer">
                                                <div className="total-price">
                                                    <span className="label">Total Amount</span>
                                                    <span className="value">₹{booking.totalPrice?.toLocaleString()}</span>
                                                </div>
                                                {booking.status === 'upcoming' && (
                                                    <div className="booking-actions">
                                                        <button
                                                            className="action-btn danger"
                                                            disabled={cancellingId === (booking._id || booking.id)}
                                                            onClick={() => handleCancel(booking._id || booking.id)}
                                                        >
                                                            {cancellingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel Booking'}
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'completed' && (
                                                    <div className="booking-actions">
                                                        <button className="action-btn primary" onClick={() => navigate('/home')}>
                                                            Book Again
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    className="no-bookings"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Car size={48} />
                                    <h3>No {activeTab} bookings found</h3>
                                    <p>Looks like you don't have any {activeTab} reservations.</p>
                                    <button
                                        style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#0071e3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                        onClick={() => navigate('/home')}
                                    >
                                        Explore Cars
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
