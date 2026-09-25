import Car from '../models/Car.js';

// @desc    Fetch all cars with optional filters
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
    try {
        const {
            category,
            seats,
            transmission,
            fuel,
            maxPrice,
            search
        } = req.query;

        const query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (seats && seats !== 'all') {
            query.seats = Number(seats);
        }

        if (transmission && transmission !== 'all') {
            query.transmission = transmission;
        }

        if (fuel && fuel !== 'all') {
            query.fuel = fuel;
        }

        if (maxPrice) {
            query.price = { $lte: Number(maxPrice) };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const cars = await Car.find(query).sort({ createdAt: -1 });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single car by ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
    try {
        const car = new Car({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            seats: req.body.seats,
            rating: req.body.rating || 4.5,
            transmission: req.body.transmission,
            fuel: req.body.fuel,
            mileage: req.body.mileage,
            image: req.body.image,
            features: req.body.features || [],
            description: req.body.description || '',
            specifications: req.body.specifications || {},
            isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
        });

        const createdCar = await car.save();
        res.status(201).json(createdCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        Object.assign(car, req.body);
        const updatedCar = await car.save();
        res.json(updatedCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await Car.deleteOne({ _id: car._id });
        res.json({ message: 'Car removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add review to car
// @route   POST /api/cars/:id/reviews
// @access  Private
export const addCarReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            avatar: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            date: 'Just now'
        };

        car.reviews.unshift(review);
        car.numReviews = car.reviews.length;
        car.rating = Number(
            (car.reviews.reduce((acc, item) => item.rating + acc, 0) / car.reviews.length).toFixed(1)
        );

        await car.save();
        res.status(201).json({ message: 'Review added', reviews: car.reviews, rating: car.rating });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
