import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from '../server/routes/authRoutes.js';
import carRoutes from '../server/routes/carRoutes.js';
import bookingRoutes from '../server/routes/bookingRoutes.js';
import offerRoutes from '../server/routes/offerRoutes.js';
import contactRoutes from '../server/routes/contactRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI is missing in environment variables. Please add MONGO_URI in Vercel Project Settings > Environment Variables.');
    }

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000
    });
    isConnected = true;
};

// Database connection middleware for serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error:', err.message);
        return res.status(500).json({
            message: `Database error: ${err.message}. Please check your MONGO_URI in Vercel settings.`
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        database: mongoose.connection.readyState === 1 ? 'Connected (MongoDB)' : 'Disconnected',
        timestamp: new Date()
    });
});

export default app;
