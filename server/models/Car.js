import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: ''
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: String,
            default: 'Recently'
        }
    },
    {
        timestamps: true
    }
);

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Car name is required'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['SUV', 'Sedan', 'Luxury', 'Hatchback']
        },
        price: {
            type: Number,
            required: [true, 'Daily rental price is required'],
            min: 0
        },
        seats: {
            type: Number,
            required: [true, 'Number of seats is required'],
            enum: [4, 5, 7]
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 1,
            max: 5
        },
        numReviews: {
            type: Number,
            default: 0
        },
        transmission: {
            type: String,
            required: [true, 'Transmission type is required'],
            enum: ['Automatic', 'Manual']
        },
        fuel: {
            type: String,
            required: [true, 'Fuel type is required'],
            enum: ['Petrol', 'Diesel', 'CNG', 'Electric']
        },
        mileage: {
            type: String,
            required: [true, 'Mileage is required']
        },
        image: {
            type: String,
            required: [true, 'Car image URL is required']
        },
        features: [
            {
                type: String
            }
        ],
        description: {
            type: String,
            default: ''
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        specifications: {
            engine: { type: String, default: 'Standard Engine' },
            power: { type: String, default: '140 HP' },
            torque: { type: String, default: '250 Nm' },
            mileage: { type: String, default: '15 kmpl' },
            transmission: { type: String, default: 'Automatic' },
            seats: { type: Number, default: 5 },
            fuel: { type: String, default: 'Petrol' },
            bootSpace: { type: String, default: '400 L' },
            groundClearance: { type: String, default: '180 mm' },
            fuelTank: { type: String, default: '45 L' }
        },
        reviews: [reviewSchema]
    },
    {
        timestamps: true
    }
);

const Car = mongoose.model('Car', carSchema);

export default Car;
