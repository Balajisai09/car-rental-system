import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import User from './models/User.js';
import Car from './models/Car.js';
import Booking from './models/Booking.js';
import Offer from './models/Offer.js';
import Contact from './models/Contact.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@godrive.com',
        password: 'password123',
        phone: '+91 99999 00000',
        location: 'Bangalore, Karnataka',
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '+91 98765 43210',
        location: 'Bangalore, India',
        role: 'user'
    }
];

const sampleReviews = [
    {
        name: 'Rahul Sharma',
        avatar: 'RS',
        rating: 5,
        comment: 'Amazing car! Very comfortable for long drives. The mileage was exactly as promised. Highly recommended for family trips.',
        date: '2 weeks ago'
    },
    {
        name: 'Priya Patel',
        avatar: 'PP',
        rating: 4,
        comment: 'Good experience overall. Car was clean and well-maintained. Pickup and drop-off was smooth.',
        date: '1 month ago'
    },
    {
        name: 'Amit Kumar',
        avatar: 'AK',
        rating: 5,
        comment: 'Excellent service! The car was in perfect condition. Will definitely book again for my next trip.',
        date: '1 month ago'
    },
    {
        name: 'Sneha Reddy',
        avatar: 'SR',
        rating: 4,
        comment: 'Smooth booking process and the car performed well on highways. Great value for money.',
        date: '2 months ago'
    }
];

const cars = [
    {
        name: 'Mahindra XUV700',
        category: 'SUV',
        price: 4500,
        seats: 7,
        rating: 4.8,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Diesel',
        mileage: '15 kmpl',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
        features: ['Panoramic Sunroof', '360 Camera', 'ADAS Level 2', 'Ventilated Seats'],
        description: 'The Mahindra XUV700 is a masterpiece of engineering, offering first-in-class autonomous driving features, world-class luxury interior, and powerful diesel engine performance.',
        specifications: {
            engine: '2.2L mHawk Diesel',
            power: '185 HP',
            torque: '420 Nm',
            mileage: '15 kmpl',
            transmission: 'Automatic',
            seats: 7,
            fuel: 'Diesel',
            bootSpace: '450 L',
            groundClearance: '200 mm',
            fuelTank: '60 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Tata Harrier',
        category: 'SUV',
        price: 3800,
        seats: 5,
        rating: 4.7,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Diesel',
        mileage: '16 kmpl',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
        features: ['Dark Edition', 'Harman Audio', 'Terrain Modes', 'Wireless Charging'],
        description: 'Built on the legendary Land Rover D8 platform, Tata Harrier delivers commanding road presence, supreme safety, and effortless power delivery.',
        specifications: {
            engine: '2.0L Kryotec Diesel',
            power: '170 HP',
            torque: '350 Nm',
            mileage: '16 kmpl',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Diesel',
            bootSpace: '425 L',
            groundClearance: '205 mm',
            fuelTank: '50 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Toyota Fortuner',
        category: 'SUV',
        price: 6500,
        seats: 7,
        rating: 4.9,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Diesel',
        mileage: '12 kmpl',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200',
        features: ['4x4 Drive', 'Power Tailgate', 'Leather Upholstery', 'Dual Zone AC'],
        description: 'The king of all terrains, Toyota Fortuner combines unmatched reliability, imposing style, and raw 4x4 capability for true adventurous souls.',
        specifications: {
            engine: '2.8L Turbo Diesel',
            power: '204 HP',
            torque: '500 Nm',
            mileage: '12 kmpl',
            transmission: 'Automatic',
            seats: 7,
            fuel: 'Diesel',
            bootSpace: '296 L',
            groundClearance: '225 mm',
            fuelTank: '80 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Mahindra Thar',
        category: 'Luxury',
        price: 3500,
        seats: 4,
        rating: 4.8,
        numReviews: 4,
        transmission: 'Manual',
        fuel: 'Diesel',
        mileage: '14 kmpl',
        image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=1200',
        features: ['Convertible Top', 'Touchscreen Infotainment', 'Off-road Tires', 'IP54 Water Resistance'],
        description: 'An iconic SUV born for exploration. Mahindra Thar gives you open-air driving freedom with high water-wading capacity and true go-anywhere spirit.',
        specifications: {
            engine: '2.2L mHawk Diesel',
            power: '130 HP',
            torque: '300 Nm',
            mileage: '14 kmpl',
            transmission: 'Manual',
            seats: 4,
            fuel: 'Diesel',
            bootSpace: '150 L',
            groundClearance: '226 mm',
            fuelTank: '57 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Kia Seltos',
        category: 'SUV',
        price: 2800,
        seats: 5,
        rating: 4.6,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: '18 kmpl',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200',
        features: ['Bose System', 'Ambient Lighting', 'HUD display', 'Smart Air Purifier'],
        description: 'Sleek, futuristic, and tech-forward. Kia Seltos elevates urban daily drives and interstate road trips with intuitive infotainment and panoramic visibility.',
        specifications: {
            engine: '1.5L Turbo Petrol',
            power: '160 HP',
            torque: '253 Nm',
            mileage: '18 kmpl',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Petrol',
            bootSpace: '433 L',
            groundClearance: '190 mm',
            fuelTank: '50 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Hyundai Verna',
        category: 'Sedan',
        price: 2500,
        seats: 5,
        rating: 4.7,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: '20 kmpl',
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200',
        features: ['Heated Seats', 'Digital Cockpit', 'Electronic Parking Brake', 'Paddle Shifters'],
        description: 'A futuristic fastback sedan with aerodynamically sculpted design, heated/ventilated front seats, and best-in-class cabin space.',
        specifications: {
            engine: '1.5L Turbo GDi',
            power: '160 HP',
            torque: '253 Nm',
            mileage: '20 kmpl',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Petrol',
            bootSpace: '528 L',
            groundClearance: '170 mm',
            fuelTank: '45 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Tata Tiago EV',
        category: 'Sedan',
        price: 1800,
        seats: 5,
        rating: 4.6,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Electric',
        mileage: '315 km/full charge',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200',
        features: ['Ziptron Tech', 'Harman Audio', 'Fast Charging', 'Climate Control'],
        description: 'Quiet, emissions-free, and rapid acceleration. The Tiago EV is perfect for clean city commuting and cost-effective weekend drives.',
        specifications: {
            engine: 'Permanent Magnet Synchronous Motor',
            power: '75 HP',
            torque: '114 Nm',
            mileage: '315 km/charge',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Electric',
            bootSpace: '240 L',
            groundClearance: '165 mm',
            fuelTank: '24 kWh Battery'
        },
        reviews: sampleReviews
    },
    {
        name: 'Maruti Swift CNG',
        category: 'Sedan',
        price: 1500,
        seats: 5,
        rating: 4.5,
        numReviews: 4,
        transmission: 'Manual',
        fuel: 'CNG',
        mileage: '30 km/kg',
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200',
        features: ['Low Running Cost', 'Reliable Engine', 'Compact Design', 'SmartPlay Studio'],
        description: 'India’s most loved hatchback sedan with ultra-efficient factory-fitted CNG and agile handling in tight city traffic.',
        specifications: {
            engine: '1.2L DualJet Dual VVT',
            power: '77 HP',
            torque: '98.5 Nm',
            mileage: '30.9 km/kg',
            transmission: 'Manual',
            seats: 5,
            fuel: 'CNG',
            bootSpace: '268 L',
            groundClearance: '163 mm',
            fuelTank: '55 L CNG + 37 L Petrol'
        },
        reviews: sampleReviews
    },
    {
        name: 'Audi Q3',
        category: 'Luxury',
        price: 8500,
        seats: 5,
        rating: 4.9,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        mileage: '12 kmpl',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1200',
        features: ['Quattro AWD', 'Virtual Cockpit', 'Panoramic Sunroof', 'Matrix LED'],
        description: 'German precision meets executive luxury. The Audi Q3 features legendary Quattro all-wheel drive, premium Bang & Olufsen sound, and dynamic LED illumination.',
        specifications: {
            engine: '2.0L TFSI Turbo',
            power: '190 HP',
            torque: '320 Nm',
            mileage: '12 kmpl',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Petrol',
            bootSpace: '530 L',
            groundClearance: '170 mm',
            fuelTank: '62 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'BMW 520d',
        category: 'Luxury',
        price: 9500,
        seats: 5,
        rating: 4.8,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Diesel',
        mileage: '14 kmpl',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
        features: ['M Sport Kit', 'Gesture Control', 'Harman Kardon', 'Active Aerodynamics'],
        description: 'The ultimate business saloon. Flawless 50:50 weight distribution, luxurious Dakota leather, and twin-power turbo performance for discerning drivers.',
        specifications: {
            engine: '2.0L BMW TwinPower Turbo',
            power: '190 HP',
            torque: '400 Nm',
            mileage: '14 kmpl',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Diesel',
            bootSpace: '530 L',
            groundClearance: '144 mm',
            fuelTank: '66 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Mercedes-Benz S-Class',
        category: 'Luxury',
        price: 15000,
        seats: 5,
        rating: 5.0,
        numReviews: 4,
        transmission: 'Automatic',
        fuel: 'Diesel',
        mileage: '10 kmpl',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
        features: ['Magic Body Control', 'Burmester 4D', 'MBUX Hyperscreen', 'Executive Seats'],
        description: 'The pinnacle of automotive engineering and prestige. Chauffeur-driven opulence with active noise cancellation and reclinable rear massage seats.',
        specifications: {
            engine: '3.0L Inline-6 Turbo Diesel',
            power: '286 HP',
            torque: '600 Nm',
            mileage: '10 kmpl',
            transmission: 'Automatic',
            seats: 5,
            fuel: 'Diesel',
            bootSpace: '550 L',
            groundClearance: '130 mm',
            fuelTank: '76 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Tata Nano',
        category: 'Sedan',
        price: 800,
        seats: 4,
        rating: 4.2,
        numReviews: 4,
        transmission: 'Manual',
        fuel: 'Petrol',
        mileage: '25 kmpl',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
        features: ['Compact Parking', 'City Maneuverability', 'AC with Heater', 'Music System'],
        description: 'The ultra-compact city commuter with an incredible turning radius, surprisingly spacious interior headroom, and pocket-friendly daily rates.',
        specifications: {
            engine: '624 cc 2-Cylinder Petrol',
            power: '38 HP',
            torque: '51 Nm',
            mileage: '25 kmpl',
            transmission: 'Manual',
            seats: 4,
            fuel: 'Petrol',
            bootSpace: '80 L',
            groundClearance: '180 mm',
            fuelTank: '24 L'
        },
        reviews: sampleReviews
    },
    {
        name: 'Chevrolet Beat',
        category: 'Hatchback',
        price: 1100,
        seats: 4,
        rating: 4.3,
        numReviews: 4,
        transmission: 'Manual',
        fuel: 'Diesel',
        mileage: '20 kmpl',
        image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200',
        features: ['Compact Design', 'Power Steering', 'Fuel Efficient', 'Rear Wiper'],
        description: 'Sporty compact hatchback with energetic diesel punch, easy-to-park footprint, and smooth power steering.',
        specifications: {
            engine: '1.0L XSDE Smartech Diesel',
            power: '57 HP',
            torque: '142 Nm',
            mileage: '24 kmpl',
            transmission: 'Manual',
            seats: 4,
            fuel: 'Diesel',
            bootSpace: '170 L',
            groundClearance: '175 mm',
            fuelTank: '35 L'
        },
        reviews: sampleReviews
    }
];

const offers = [
    {
        code: 'FIRST500',
        title: 'Welcome Bonus',
        description: 'Get flat ₹500 OFF on your first booking with us. No minimum booking value required.',
        discountType: 'flat',
        discountValue: 500,
        expiry: 'Valid till 31st Dec',
        color: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
        isActive: true
    },
    {
        code: 'HDFC10',
        title: 'HDFC Bank Offer',
        description: 'Get 10% instant discount up to ₹1500 on all HDFC Credit & Debit Cards.',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 1500,
        expiry: 'Valid on weekends',
        color: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
        isActive: true
    },
    {
        code: 'WEEKEND15',
        title: 'Weekend Getaway',
        description: 'Plan a trip this weekend (Sat-Sun) and get flat 15% OFF on SUV bookings.',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscount: 2000,
        expiry: 'Every Weekend',
        color: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
        isActive: true
    },
    {
        code: 'LONGDRIVE',
        title: 'Long Duration Special',
        description: 'Book for 5 days or more and get 1 day rental absolutely FREE (up to ₹2500 off).',
        discountType: 'flat',
        discountValue: 2500,
        minBookingValue: 10000,
        expiry: 'Limited Time Offer',
        color: 'linear-gradient(135deg, #fdcb6e 0%, #fab1a0 100%)',
        isActive: true
    }
];

export const seedInitialData = async () => {
    if (await User.countDocuments() === 0) {
        for (const user of users) {
            await User.create(user);
        }
    }

    if (await Car.countDocuments() === 0) {
        await Car.insertMany(cars);
    }

    for (const offer of offers) {
        await Offer.updateOne({ code: offer.code }, { $setOnInsert: offer }, { upsert: true });
    }
};

export const seedDatabase = async () => {
    try {
        console.log('Seeding Database...'.yellow);

        // Clear existing data
        await Booking.deleteMany({});
        await Car.deleteMany({});
        await User.deleteMany({});
        await Offer.deleteMany({});
        await Contact.deleteMany({});

        // Create users
        const createdUsers = [];
        for (const user of users) {
            const u = await User.create(user);
            createdUsers.push(u);
        }
        const demoUser = createdUsers.find(u => u.role === 'user');

        // Create cars
        const createdCars = await Car.insertMany(cars);

        // Create offers
        await Offer.insertMany(offers);

        // Create sample bookings for demo user
        const sampleBookings = [
            {
                user: demoUser._id,
                car: createdCars[0]._id,
                carName: createdCars[0].name,
                carImage: createdCars[0].image,
                startDate: '2026-02-12',
                startTime: '10:00 AM',
                endDate: '2026-02-15',
                endTime: '10:00 PM',
                location: 'Bangalore International Airport',
                coverage: 'Full Protection',
                dailyPrice: createdCars[0].price,
                days: 3,
                platformFee: 150,
                totalPrice: createdCars[0].price * 3 + 150,
                status: 'upcoming',
                bookingDate: '28 Jan 2026'
            },
            {
                user: demoUser._id,
                car: createdCars[5]._id,
                carName: createdCars[5].name,
                carImage: createdCars[5].image,
                startDate: '2025-12-10',
                startTime: '09:00 AM',
                endDate: '2025-12-12',
                endTime: '08:00 PM',
                location: 'Indiranagar, Bangalore',
                coverage: 'Standard Insurance',
                dailyPrice: createdCars[5].price,
                days: 2,
                platformFee: 150,
                totalPrice: createdCars[5].price * 2 + 150,
                status: 'completed',
                bookingDate: '01 Dec 2025'
            },
            {
                user: demoUser._id,
                car: createdCars[7]._id,
                carName: createdCars[7].name,
                carImage: createdCars[7].image,
                startDate: '2025-11-05',
                startTime: '11:00 AM',
                endDate: '2025-11-06',
                endTime: '11:00 AM',
                location: 'Koramangala, Bangalore',
                coverage: 'Standard Insurance',
                dailyPrice: createdCars[7].price,
                days: 1,
                platformFee: 150,
                totalPrice: createdCars[7].price + 150,
                status: 'cancelled',
                bookingDate: '01 Nov 2025'
            }
        ];

        await Booking.insertMany(sampleBookings);

        console.log('Database Seeded Successfully!'.green.inverse);
    } catch (error) {
        console.error(`Seeding Error: ${error.message}`.red.inverse);
        throw error;
    }
};

// Check if running directly
if (process.argv[1]?.includes('seeder.js')) {
    connectDB().then(async () => {
        if (process.argv[2] === '-d') {
            await Booking.deleteMany({});
            await Car.deleteMany({});
            await User.deleteMany({});
            await Offer.deleteMany({});
            await Contact.deleteMany({});
            console.log('Data Destroyed!'.red.inverse);
            process.exit();
        } else {
            await seedDatabase();
            process.exit();
        }
    });
}
