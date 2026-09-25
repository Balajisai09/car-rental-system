import Contact from '../models/Contact.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const contact = await Contact.create({
            name,
            email,
            message
        });

        res.status(201).json({
            message: 'Your message has been sent successfully! Our team will contact you shortly.',
            contact
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
