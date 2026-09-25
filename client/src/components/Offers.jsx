import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Calendar, CreditCard, Gift, Copy, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Offers.css';

const Offers = () => {
    const navigate = useNavigate();

    const initialOffers = [
        {
            id: 1,
            code: 'FIRST500',
            title: 'Welcome Bonus',
            description: 'Get flat ₹500 OFF on your first booking with us. No minimum booking value required.',
            expiry: 'Valid till 31st Dec',
            icon: <Gift size={32} />,
            color: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)'
        },
        {
            id: 2,
            code: 'HDFC10',
            title: 'HDFC Bank Offer',
            description: 'Get 10% instant discount up to ₹1500 on all HDFC Credit & Debit Cards.',
            expiry: 'Valid on weekends',
            icon: <CreditCard size={32} />,
            color: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)'
        },
        {
            id: 3,
            code: 'WEEKEND15',
            title: 'Weekend Getaway',
            description: 'Plan a trip this weekend (Sat-Sun) and get flat 15% OFF on SUV bookings.',
            expiry: 'Every Weekend',
            icon: <Calendar size={32} />,
            color: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
        },
        {
            id: 4,
            code: 'LONGDRIVE',
            title: 'Long Duration Special',
            description: 'Book for 5 days or more and get 1 day rental absolutely FREE.',
            expiry: 'Limited Time Offer',
            icon: <Tag size={32} />,
            color: 'linear-gradient(135deg, #fdcb6e 0%, #fab1a0 100%)'
        }
    ];

    const [offers, setOffers] = useState(initialOffers);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await api.getOffers();
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data.map(o => ({
                        id: o._id || o.code,
                        code: o.code,
                        title: o.title,
                        description: o.description,
                        expiry: o.expiry,
                        icon: o.discountType === 'percentage' ? <CreditCard size={32} /> : <Gift size={32} />,
                        color: o.color || 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)'
                    }));
                    setOffers(mapped);
                }
            } catch (err) {
                console.warn('Using default offers:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Coupon code ${code} copied to clipboard!`);
    };

    return (
        <div className="offers-page-wrapper">
            <div className="offers-container">
                <motion.div
                    className="offers-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>Exclusive Offers</h1>
                    <p>Trending deals curated just for you from our database. Grab them before they expire!</p>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', gap: '0.75rem', color: '#888' }}>
                        <Loader size={24} className="animate-spin" />
                        <span>Loading offers...</span>
                    </div>
                ) : (
                    <div className="offers-grid">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={offer.id}
                                className="offer-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="offer-icon-wrapper" style={{ background: offer.color }}>
                                    {offer.icon}
                                </div>
                                <div className="offer-content">
                                    <span className="offer-expiry">{offer.expiry}</span>
                                    <h3>{offer.title}</h3>
                                    <p>{offer.description}</p>

                                    <div className="coupon-section">
                                        <div className="coupon-code">
                                            {offer.code}
                                        </div>
                                        <button className="copy-btn" onClick={() => copyCode(offer.code)} title="Copy Code">
                                            <Copy size={18} />
                                        </button>
                                    </div>

                                    <button className="apply-btn" onClick={() => navigate('/home')}>
                                        Book Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Offers;
