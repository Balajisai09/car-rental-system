import express from 'express';
import {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    addCarReview
} from '../controllers/carController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCars)
    .post(protect, admin, createCar);

router.route('/:id')
    .get(getCarById)
    .put(protect, admin, updateCar)
    .delete(protect, admin, deleteCar);

router.route('/:id/reviews')
    .post(protect, addCarReview);

export default router;
