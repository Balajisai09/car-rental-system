import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        discountType: {
            type: String,
            enum: ['flat', 'percentage'],
            default: 'flat'
        },
        discountValue: {
            type: Number,
            required: true
        },
        maxDiscount: {
            type: Number,
            default: 1500
        },
        minBookingValue: {
            type: Number,
            default: 0
        },
        expiry: {
            type: String,
            default: 'Limited Time Offer'
        },
        color: {
            type: String,
            default: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
