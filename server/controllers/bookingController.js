import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import mongoose from 'mongoose';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { carId, startDate, endDate, startTime, endTime, location, coverage } = req.body;

        if (!carId || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide a car and rental dates' });
        }

        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.status(400).json({ message: 'Invalid car selected' });
        }

        const isValidDate = (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
            const date = new Date(`${value}T00:00:00.000Z`);
            return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
        };

        if (!isValidDate(startDate) || !isValidDate(endDate) || endDate < startDate) {
            return res.status(400).json({ message: 'Please provide valid rental dates' });
        }

        const today = new Date().toISOString().slice(0, 10);
        if (startDate < today) {
            return res.status(400).json({ message: 'Pickup date cannot be in the past' });
        }

        if (!['Standard Insurance', 'Full Protection'].includes(coverage || 'Standard Insurance')) {
            return res.status(400).json({ message: 'Invalid coverage option' });
        }

        const car = await Car.findById(carId);
        if (!car || !car.isAvailable) {
            return res.status(404).json({ message: 'Selected car is unavailable' });
        }

        const existingBooking = await Booking.findOne({
            car: car._id,
            status: { $ne: 'cancelled' },
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        });
        if (existingBooking) {
            return res.status(409).json({ message: 'Selected car is already booked for these dates' });
        }

        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T00:00:00.000Z`);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const dailyCoverage = coverage === 'Full Protection' ? 499 : 0;
        const platformFee = 150;
        const totalPrice = (car.price + dailyCoverage) * days + platformFee;

        const booking = new Booking({
            user: req.user._id,
            car: car._id,
            carName: car.name,
            carImage: car.image,
            startDate,
            startTime: startTime || '10:00 AM',
            endDate,
            endTime: endTime || '10:00 PM',
            location: location || 'Bangalore City Center',
            coverage: coverage || 'Standard Insurance',
            dailyPrice: car.price,
            days,
            platformFee,
            totalPrice,
            status: 'upcoming'
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is owner or admin
        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'cancelled';
        const updatedBooking = await booking.save();
        res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (admin or modify)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status || booking.status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
