import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: false
        },
        carName: {
            type: String,
            required: true
        },
        carImage: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            default: '10:00 AM'
        },
        endDate: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            default: '10:00 PM'
        },
        location: {
            type: String,
            required: true,
            default: 'Bangalore Airport'
        },
        coverage: {
            type: String,
            enum: ['Standard Insurance', 'Full Protection'],
            default: 'Standard Insurance'
        },
        dailyPrice: {
            type: Number,
            required: true
        },
        days: {
            type: Number,
            required: true,
            default: 1
        },
        platformFee: {
            type: Number,
            default: 150
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['upcoming', 'completed', 'cancelled'],
            default: 'upcoming'
        },
        bookingDate: {
            type: String,
            default: () =>
                new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
