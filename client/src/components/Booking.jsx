import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Shield, Clock, ChevronLeft, CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../services/api';
import './Booking.css';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const car = location.state?.car;

    const [dates, setDates] = useState({
        pickup: '',
        dropoff: ''
    });
    const [selectedCoverage, setSelectedCoverage] = useState('Standard Insurance');
    const [pickupLocation, setPickupLocation] = useState('Bangalore International Airport');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    if (!car) {
        return (
            <div className="booking-error">
                <h2>No car selected</h2>
                <button onClick={() => navigate('/home')}>Back to Search</button>
            </div>
        );
    }

    const coverageCostPerDay = selectedCoverage === 'Full Protection' ? 499 : 0;

    const calculateDays = () => {
        if (!dates.pickup || !dates.dropoff) return 1;
        const start = new Date(dates.pickup);
        const end = new Date(dates.dropoff);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    };

    const calculateTotal = () => {
        const days = calculateDays();
        return (car.price * days) + (coverageCostPerDay * days) + 150;
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const days = calculateDays();
        const totalPrice = calculateTotal();

        try {
            await api.createBooking({
                carId: car._id || null,
                carName: car.name,
                carImage: car.image,
                startDate: dates.pickup,
                startTime: '10:00 AM',
                endDate: dates.dropoff,
                endTime: '10:00 PM',
                location: pickupLocation,
                coverage: selectedCoverage,
                dailyPrice: car.price,
                days,
                totalPrice
            });

            setIsConfirmed(true);
            setTimeout(() => {
                navigate('/bookings');
            }, 2500);
        } catch (err) {
            setError(err.message || 'Failed to place booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-page-wrapper">
            <div className="booking-container">
                <div className="booking-layout">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} /> Back
                    </button>

                    <div className="booking-grid">
                        {/* Left: Car Details & Form */}
                        <div className="booking-main">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="booking-card"
                            >
                                <div className="booking-header">
                                    <h1>Confirm Your Booking</h1>
                                    <p>Review your selection and pick your travel dates.</p>
                                </div>

                                {error && (
                                    <div style={{
                                        background: 'rgba(255, 77, 79, 0.15)',
                                        border: '1px solid #ff4d4f',
                                        color: '#ff7875',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        marginBottom: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <AlertCircle size={18} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form className="booking-form" onSubmit={handleConfirm}>
                                    <div className="form-section">
                                        <h3><Calendar size={18} /> Rental Period</h3>
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Pickup Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={dates.pickup}
                                                    onChange={(e) => setDates({ ...dates, pickup: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Drop-off Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    min={dates.pickup || new Date().toISOString().split('T')[0]}
                                                    value={dates.dropoff}
                                                    onChange={(e) => setDates({ ...dates, dropoff: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3><MapPin size={18} /> Pickup & Return Location</h3>
                                        <div className="input-group" style={{ marginTop: '0.5rem' }}>
                                            <input
                                                type="text"
                                                required
                                                value={pickupLocation}
                                                onChange={(e) => setPickupLocation(e.target.value)}
                                                placeholder="e.g. Bangalore Airport, Indiranagar, etc."
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3><Shield size={18} /> Coverage Options</h3>
                                        <div className="options-grid">
                                            <div
                                                className={`option-item ${selectedCoverage === 'Standard Insurance' ? 'active' : ''}`}
                                                onClick={() => setSelectedCoverage('Standard Insurance')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="option-info">
                                                    <h4>Standard Insurance</h4>
                                                    <p>Basic coverage included</p>
                                                </div>
                                                <div className="option-price">Free</div>
                                            </div>
                                            <div
                                                className={`option-item ${selectedCoverage === 'Full Protection' ? 'active' : ''}`}
                                                onClick={() => setSelectedCoverage('Full Protection')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="option-info">
                                                    <h4>Full Protection</h4>
                                                    <p>Zero liability & 24/7 road assistance</p>
                                                </div>
                                                <div className="option-price">+₹499/day</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3><CreditCard size={18} /> Payment Information</h3>
                                        <div className="payment-preview">
                                            <div className="preview-item">
                                                <span>Daily Rate</span>
                                                <span>₹{car.price.toLocaleString()}</span>
                                            </div>
                                            <div className="preview-item">
                                                <span>Duration</span>
                                                <span>{calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}</span>
                                            </div>
                                            {selectedCoverage === 'Full Protection' && (
                                                <div className="preview-item">
                                                    <span>Full Protection</span>
                                                    <span>₹{(499 * calculateDays()).toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="preview-item">
                                                <span>Platform Fee</span>
                                                <span>₹150</span>
                                            </div>
                                            <hr />
                                            <div className="preview-item total">
                                                <span>Total (Est.)</span>
                                                <span>₹{calculateTotal().toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="confirm-btn"
                                        disabled={loading}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader size={18} className="animate-spin" />
                                                <span>Saving Reservation to Database...</span>
                                            </>
                                        ) : (
                                            'Confirm Reservation'
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                        {/* Right: Summary Sidebar */}
                        <aside className="booking-summary">
                            <div className="summary-card sticky">
                                <div className="summary-img">
                                    <img src={car.image} alt={car.name} />
                                </div>
                                <div className="summary-content">
                                    <h2>{car.name}</h2>
                                    <div className="summary-specs">
                                        <span>{car.category}</span>
                                        <span>•</span>
                                        <span>{car.transmission}</span>
                                        <span>•</span>
                                        <span>{car.fuel}</span>
                                    </div>

                                    <div className="summary-details">
                                        <div className="detail-item">
                                            <MapPin size={16} />
                                            <div>
                                                <label>Pickup Location</label>
                                                <p>{pickupLocation}</p>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <Clock size={16} />
                                            <div>
                                                <label>Duration</label>
                                                <p>{dates.pickup && dates.dropoff ? `${calculateDays()} Days` : 'Select dates to view'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Success Overlay */}
                {isConfirmed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="success-overlay"
                    >
                        <div className="success-content">
                            <div className="success-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h2>Booking Confirmed!</h2>
                            <p>Your reservation for <strong>{car.name}</strong> has been saved to the database.</p>
                            <p className="redirect-text">Redirecting to My Bookings...</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Booking;
