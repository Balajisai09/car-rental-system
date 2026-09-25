import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Filter, Star, Info, Fuel, Gauge, Car, Loader } from 'lucide-react';
import api from '../services/api';
import './CarsList.css';
import kiaImg from '../assets/kia.jpeg';
import tiagoImg from '../assets/tiagoev.jpeg';
import swiftImg from '../assets/swift.avif';
import nanoImg from '../assets/TataNano.avif';
import beatImg from '../assets/Chevrolet-Beat.avif';

const CarsList = ({ searchParams: propSearchParams, embedded }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = propSearchParams || location.state || {};

    const [filters, setFilters] = useState({
        seats: searchParams.seats || 'all',
        category: 'all',
        transmission: 'all',
        fuel: 'all',
        priceRange: 15000
    });

    const [dbCars, setDbCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackCars = [
        {
            id: 1,
            name: 'Mahindra XUV700',
            category: 'SUV',
            price: 4500,
            seats: 7,
            rating: 4.8,
            transmission: 'Automatic',
            fuel: 'Diesel',
            mileage: '15 kmpl',
            image: '/cars/xuv700.png',
            features: ['Panoramic Sunroof', '360 Camera', 'ADAS Level 2', 'Ventilated Seats']
        },
        {
            id: 2,
            name: 'Tata Harrier',
            category: 'SUV',
            price: 3800,
            seats: 5,
            rating: 4.7,
            transmission: 'Automatic',
            fuel: 'Diesel',
            mileage: '16 kmpl',
            image: '/cars/harrier.png',
            features: ['Dark Edition', 'Harman Audio', 'Terrain Modes', 'Wireless Charging']
        },
        {
            id: 3,
            name: 'Toyota Fortuner',
            category: 'SUV',
            price: 6500,
            seats: 7,
            rating: 4.9,
            transmission: 'Automatic',
            fuel: 'Diesel',
            mileage: '12 kmpl',
            image: '/cars/fortuner.png',
            features: ['4x4 Drive', 'Power Tailgate', 'Leather Upholstery', 'Dual Zone AC']
        },
        {
            id: 4,
            name: 'Mahindra Thar',
            category: 'Luxury',
            price: 3500,
            seats: 4,
            rating: 4.8,
            transmission: 'Manual',
            fuel: 'Diesel',
            mileage: '14 kmpl',
            image: '/cars/thar.png',
            features: ['Convertible Top', 'Touchscreen Infotainment', 'Off-road Tires', 'IP54 Water Resistance']
        },
        {
            id: 5,
            name: 'Kia Seltos',
            category: 'SUV',
            price: 2800,
            seats: 5,
            rating: 4.6,
            transmission: 'Automatic',
            fuel: 'Petrol',
            mileage: '18 kmpl',
            image: kiaImg,
            features: ['Bose System', 'Ambient Lighting', 'HUD display', 'Smart Air Purifier']
        },
        {
            id: 6,
            name: 'Hyundai Verna',
            category: 'Sedan',
            price: 2500,
            seats: 5,
            rating: 4.7,
            transmission: 'Automatic',
            fuel: 'Petrol',
            mileage: '20 kmpl',
            image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200',
            features: ['Heated Seats', 'Digital Cockpit', 'Electronic Parking Brake', 'Paddle Shifters']
        },
        {
            id: 7,
            name: 'Tata Tiago EV',
            category: 'Sedan',
            price: 1800,
            seats: 5,
            rating: 4.6,
            transmission: 'Automatic',
            fuel: 'Electric',
            mileage: '315 km/full charge',
            image: tiagoImg,
            features: ['Ziptron Tech', 'Harman Audio', 'Fast Charging', 'Climate Control']
        },
        {
            id: 8,
            name: 'Maruti Swift CNG',
            category: 'Sedan',
            price: 1500,
            seats: 5,
            rating: 4.5,
            transmission: 'Manual',
            fuel: 'CNG',
            mileage: '30 km/kg',
            image: swiftImg,
            features: ['Low Running Cost', 'Reliable Engine', 'Compact Design', 'SmartPlay Studio']
        },
        {
            id: 9,
            name: 'Audi Q3',
            category: 'Luxury',
            price: 8500,
            seats: 5,
            rating: 4.9,
            transmission: 'Automatic',
            fuel: 'Petrol',
            mileage: '12 kmpl',
            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1200',
            features: ['Quattro AWD', 'Virtual Cockpit', 'Panoramic Sunroof', 'Matrix LED']
        },
        {
            id: 10,
            name: 'BMW 520d',
            category: 'Luxury',
            price: 9500,
            seats: 5,
            rating: 4.8,
            transmission: 'Automatic',
            fuel: 'Diesel',
            mileage: '14 kmpl',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
            features: ['M Sport Kit', 'Gesture Control', 'Harman Kardon', 'Active Aerodynamics']
        },
        {
            id: 11,
            name: 'Mercedes-Benz S-Class',
            category: 'Luxury',
            price: 15000,
            seats: 5,
            rating: 5.0,
            transmission: 'Automatic',
            fuel: 'Diesel',
            mileage: '10 kmpl',
            image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
            features: ['Magic Body Control', 'Burmester 4D', 'MBUX Hyperscreen', 'Executive Seats']
        },
        {
            id: 12,
            name: 'Tata Nano',
            category: 'Sedan',
            price: 800,
            seats: 4,
            rating: 4.2,
            transmission: 'Manual',
            fuel: 'Petrol',
            mileage: '25 kmpl',
            image: nanoImg,
            features: ['Compact Parking', 'City Maneuverability', 'AC with Heater', 'Music System']
        },
        {
            id: 13,
            name: 'Chevrolet Beat',
            category: 'Hatchback',
            price: 1100,
            seats: 4,
            rating: 4.3,
            transmission: 'Manual',
            fuel: 'Diesel',
            mileage: '20 kmpl',
            image: beatImg,
            features: ['Compact Design', 'Power Steering', 'Fuel Efficient', 'Rear Wiper']
        }
    ];

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const data = await api.getCars();
                if (Array.isArray(data) && data.length > 0) {
                    setDbCars(data);
                } else {
                    setDbCars(fallbackCars);
                }
            } catch (err) {
                console.warn('Using local fallback cars:', err.message);
                setDbCars(fallbackCars);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const carSource = dbCars.length > 0 ? dbCars : fallbackCars;

    const filteredCars = carSource.filter(car => {
        return (filters.seats === 'all' || car.seats === parseInt(filters.seats)) &&
            (filters.category === 'all' || car.category === filters.category) &&
            (filters.transmission === 'all' || car.transmission === filters.transmission) &&
            (filters.fuel === 'all' || car.fuel === filters.fuel) &&
            (car.price <= filters.priceRange);
    });

    return (
        <div className={embedded ? '' : 'cars-list-page-wrapper'}>
            <div className={`cars-list-container ${embedded ? 'embedded' : ''}`}>
                <div className="cars-list-layout">
                    {/* Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <div className="filter-header">
                            <Filter size={20} />
                            <h3>Filters</h3>
                        </div>

                        <div className="filter-group">
                            <label>Seats</label>
                            <select
                                value={filters.seats}
                                onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
                            >
                                <option value="all">All Seats</option>
                                <option value="4">4 Seater</option>
                                <option value="5">5 Seater</option>
                                <option value="7">7 Seater</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Transmission</label>
                            <select
                                value={filters.transmission}
                                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                            >
                                <option value="all">All Transmissions</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Fuel Type</label>
                            <select
                                value={filters.fuel}
                                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                            >
                                <option value="all">All Fuel Types</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="CNG">CNG</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="all">All Categories</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Hatchback">Hatchback</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Max Price: ₹{filters.priceRange.toLocaleString()}</label>
                            <input
                                type="range"
                                min="1000"
                                max="15000"
                                step="500"
                                value={filters.priceRange}
                                onChange={(e) => setFilters({ ...filters, priceRange: parseInt(e.target.value) })}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="cars-grid-section">
                        <div className="results-header">
                            <h2>Available Cars in <span>{searchParams.location || 'Your Area'}</span></h2>
                            <p>{filteredCars.length} results found</p>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', gap: '0.75rem', color: '#888' }}>
                                <Loader size={24} className="animate-spin" />
                                <span>Loading cars from database...</span>
                            </div>
                        ) : (
                            <div className="cars-grid">
                                {filteredCars.map(car => (
                                    <motion.div
                                        key={car._id || car.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="car-list-card"
                                    >
                                        <div className="car-card-img">
                                            <img src={car.image} alt={car.name} />
                                            <div className="car-tag">{car.category}</div>
                                        </div>
                                        <div className="car-card-body">
                                            <div className="car-name-row">
                                                <h3>{car.name}</h3>
                                                <div className="car-rating">
                                                    <Star size={14} fill="#FFD700" color="#FFD700" />
                                                    <span>{car.rating}</span>
                                                </div>
                                            </div>
                                            <div className="car-specs">
                                                <span><Users size={14} /> {car.seats} Seats</span>
                                                <span><Fuel size={14} /> {car.fuel}</span>
                                                <span><Gauge size={14} /> {car.mileage}</span>
                                                <span>{car.transmission}</span>
                                            </div>
                                            <div className="car-features-list">
                                                {car.features?.map((feature, idx) => (
                                                    <span key={idx} className="feature-pill"><Car size={10} /> {feature}</span>
                                                ))}
                                            </div>
                                            <hr className="divider" />
                                            <div className="car-footer">
                                                <div className="car-price">
                                                    <span className="amount">₹{car.price.toLocaleString()}</span>
                                                    <span className="unit">/day</span>
                                                </div>
                                                <button
                                                    className="select-car-btn"
                                                    onClick={() => navigate('/car-details', { state: { car } })}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CarsList;
