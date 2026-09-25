import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import Car from './models/Car.js';
import { seedInitialData, seedDatabase } from './seeder.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.json({
        status: 'UP',
        message: 'GoDrive Car Rentals API is running smoothly',
        database: isDbConnected ? 'Connected (MongoDB)' : 'Disconnected (Check server/.env MONGO_URI)',
        timestamp: new Date()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
    // Attempt DB connection
    const connected = await connectDB();

    if (connected) {
        try {
            await seedInitialData();
            console.log('Database initialized successfully!'.green);
        } catch (e) {
            console.log('Database initialization notice:', e.message);
        }
    }

    app.listen(PORT, () => {
        console.log(`🚀 GoDrive API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
        console.log(`👉 Health check: http://localhost:${PORT}/api/health`.green);
    });
};

startServer();
