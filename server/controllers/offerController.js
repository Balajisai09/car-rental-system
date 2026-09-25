import Offer from '../models/Offer.js';

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
export const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate coupon code and return discount
// @route   POST /api/offers/validate
// @access  Public
export const validateOffer = async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        const offer = await Offer.findOne({
            code: code.toUpperCase().trim(),
            isActive: true
        });

        if (!offer) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        if (amount && offer.minBookingValue > amount) {
            return res.status(400).json({
                message: `Minimum booking amount of ₹${offer.minBookingValue} required for this code`
            });
        }

        let discount = 0;
        if (offer.discountType === 'flat') {
            discount = offer.discountValue;
        } else if (offer.discountType === 'percentage') {
            discount = ((amount || 0) * offer.discountValue) / 100;
            if (offer.maxDiscount && discount > offer.maxDiscount) {
                discount = offer.maxDiscount;
            }
        }

        res.json({
            valid: true,
            code: offer.code,
            title: offer.title,
            discount: Math.round(discount),
            finalAmount: Math.max(0, Math.round((amount || 0) - discount))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
