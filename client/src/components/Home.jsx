import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Calendar, Clock, Search, ShieldCheck, Headset, Zap, CreditCard, Mail, Phone, Send } from 'lucide-react';
import CarsList from './CarsList';
import './Home.css';
import api from '../services/api';
import swiftImg from '../assets/swift.avif';


const Home = () => {
    const navigate = useNavigate();
    const [showCars, setShowCars] = useState(false);
    const [searchData, setSearchData] = useState({
        location: '',
        seats: '5',
        pickupDate: '',
        returnDate: '',
        pickupTime: '10:00',
        returnTime: '10:00'
    });

    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [contactStatus, setContactStatus] = useState({ loading: false, success: '', error: '' });

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactStatus({ loading: true, success: '', error: '' });
        try {
            await api.submitContact(contactForm);
            setContactStatus({ loading: false, success: 'Thank you! Your message has been saved to the database.', error: '' });
            setContactForm({ name: '', email: '', message: '' });
            setTimeout(() => setContactStatus(prev => ({ ...prev, success: '' })), 4000);
        } catch (err) {
            setContactStatus({ loading: false, success: '', error: err.message || 'Failed to send message.' });
        }
    };

    const handleChange = (e) => {
        setSearchData({ ...searchData, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchData);
        setShowCars(true);
        // We no longer need to navigate
        // navigate('/cars', { state: searchData });
    };

    return (
        <div className="home-container">
            <AnimatePresence mode="wait">
                {!showCars ? (
                    <motion.div
                        key="hero-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Hero Section */}
                        <section className="hero">
                            <div className="hero-content">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    Your Premium Journey <br />Starts <span>Here</span>.
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Select your destination, pick a ride, and hit the road in style.
                                </motion.p>
                                <motion.button
                                    className="view-fleet-btn"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    onClick={() => document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    View Our Fleet
                                </motion.button>
                            </div>

                            {/* Search Bar Container */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="search-section"
                            >
                                <form className="search-form" onSubmit={handleSearch}>
                                    {/* Location */}
                                    <div className="search-field">
                                        <label><MapPin size={16} /> Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Where to?"
                                            value={searchData.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Seats */}
                                    <div className="search-field">
                                        <label><Users size={16} /> Seats</label>
                                        <select name="seats" value={searchData.seats} onChange={handleChange}>
                                            <option value="5">5 Seater</option>
                                            <option value="7">7 Seater</option>
                                        </select>
                                    </div>

                                    {/* Pickup Info */}
                                    <div className="search-field">
                                        <label><Calendar size={16} /> Pickup Date</label>
                                        <input
                                            type="date"
                                            name="pickupDate"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={searchData.pickupDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="search-field">
                                        <label><Clock size={16} /> Pickup Time</label>
                                        <input
                                            type="time"
                                            name="pickupTime"
                                            value={searchData.pickupTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Return Info */}
                                    <div className="search-field">
                                        <label><Calendar size={16} /> Return Date</label>
                                        <input
                                            type="date"
                                            name="returnDate"
                                            min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                                            value={searchData.returnDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="search-field">
                                        <label><Clock size={16} /> Return Time</label>
                                        <input
                                            type="time"
                                            name="returnTime"
                                            value={searchData.returnTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="search-action">
                                        <button type="submit" className="search-btn">
                                            <Search size={20} />
                                            <span>Search Car</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </section>

                        {/* Featured Section */}
                        <section id="fleet" className="featured-section">
                            <div className="section-header">
                                <h2>Our Premium Fleet</h2>
                                <p>Curated selection of luxury vehicles for your comfort.</p>
                            </div>

                            <div className="fleet-grid">
                                {[
                                    {
                                        id: 1,
                                        name: 'Mahindra XUV700',
                                        price: 4500,
                                        image: '/cars/xuv700.png',
                                        seats: 7,
                                        transmission: 'Automatic',
                                        fuel: 'Diesel',
                                        rating: 4.8,
                                        features: ['Panoramic Sunroof', '360 Camera', 'ADAS Level 2']
                                    },
                                    {
                                        id: 6,
                                        name: 'Hyundai Verna',
                                        price: 2500,
                                        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200',
                                        seats: 5,
                                        transmission: 'Automatic',
                                        fuel: 'Petrol',
                                        rating: 4.7,
                                        features: ['Heated Seats', 'Digital Cockpit', 'Sunroof']
                                    },
                                    {
                                        id: 2,
                                        name: 'Tata Harrier',
                                        price: 3800,
                                        image: '/cars/harrier.png',
                                        seats: 5,
                                        transmission: 'Automatic',
                                        fuel: 'Diesel',
                                        rating: 4.7,
                                        features: ['Dark Edition', 'Harman Audio', 'Terrain Modes']
                                    },
                                    {
                                        id: 8,
                                        name: 'Maruti Swift CNG',
                                        price: 1500,
                                        image: swiftImg,
                                        seats: 5,
                                        transmission: 'Manual',
                                        fuel: 'CNG',
                                        rating: 4.5,
                                        features: ['Low Running Cost', 'Reliable', 'Compact']
                                    }
                                ].map(car => (
                                    <motion.div
                                        key={car.id}
                                        whileHover={{ y: -10 }}
                                        className="car-card"
                                    >
                                        <div className="car-image">
                                            <img src={car.image} alt={car.name} />
                                            <div className="car-price">₹{car.price.toLocaleString()}/day</div>
                                        </div>
                                        <div className="car-info">
                                            <h3>{car.name}</h3>
                                            <div className="car-stats">
                                                <span><Users size={14} /> {car.seats} Seats</span>
                                                <span>{car.transmission}</span>
                                            </div>
                                            <button
                                                className="book-now-btn"
                                                onClick={() => navigate('/car-details', { state: { car } })}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Why Choose Us Section */}
                        <section className="why-choose-us">
                            <div className="section-header">
                                <h2>Why Choose Us</h2>
                                <p>Experience the difference with our premium car rental service.</p>
                            </div>
                            <div className="features-grid">
                                {[
                                    {
                                        icon: <ShieldCheck size={40} />,
                                        title: 'Safety First',
                                        desc: 'All our cars undergo rigorous 60-point safety checks before every trip.'
                                    },
                                    {
                                        icon: <CreditCard size={40} />,
                                        title: 'Transparent Pricing',
                                        desc: 'No hidden charges. What you see is what you pay, always.'
                                    },
                                    {
                                        icon: <Zap size={40} />,
                                        title: 'Instant Booking',
                                        desc: 'Book your dream car in less than 2 minutes with our seamless app.'
                                    },
                                    {
                                        icon: <Headset size={40} />,
                                        title: '24/7 Support',
                                        desc: 'Our dedicated support team is always available to assist you.'
                                    }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -10 }}
                                        className="feature-card"
                                    >
                                        <div className="feature-icon">{feature.icon}</div>
                                        <h3>{feature.title}</h3>
                                        <p>{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Contact Us Section */}
                        <section className="contact-us">
                            <div className="section-header">
                                <h2>Get in Touch</h2>
                                <p>Have questions? We'd love to hear from you.</p>
                            </div>
                            <div className="contact-container">
                                <motion.div
                                    className="contact-info"
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="info-item">
                                        <div className="info-icon"><Phone size={24} /></div>
                                        <div>
                                            <h4>Phone</h4>
                                            <p>+91 98765 43210</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><Mail size={24} /></div>
                                        <div>
                                            <h4>Email</h4>
                                            <p>support@carrentals.com</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><MapPin size={24} /></div>
                                        <div>
                                            <h4>Office</h4>
                                            <p>123, Premium Tower, Bangalore, Karnataka - 560001</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.form
                                    className="contact-form"
                                    initial={{ x: 20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    onSubmit={handleContactSubmit}
                                >
                                    {contactStatus.success && (
                                        <div style={{ padding: '0.75rem', background: 'rgba(82, 196, 26, 0.2)', border: '1px solid #52c41a', color: '#73d13d', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                            {contactStatus.success}
                                        </div>
                                    )}
                                    {contactStatus.error && (
                                        <div style={{ padding: '0.75rem', background: 'rgba(255, 77, 79, 0.2)', border: '1px solid #ff4d4f', color: '#ff7875', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                            {contactStatus.error}
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            placeholder="Your Message"
                                            rows="5"
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="submit-btn" disabled={contactStatus.loading}>
                                        <Send size={18} /> {contactStatus.loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </motion.form>
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <motion.div
                        key="search-results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="search-results-wrapper"
                    >
                        <div className="back-to-search-header">
                            <button className="back-btn" onClick={() => setShowCars(false)}>
                                ← Modify Search
                            </button>
                        </div>
                        <CarsList searchParams={searchData} embedded />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
