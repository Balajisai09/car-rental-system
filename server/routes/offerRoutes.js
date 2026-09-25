import express from 'express';
import { getOffers, validateOffer } from '../controllers/offerController.js';

const router = express.Router();

router.get('/', getOffers);
router.post('/validate', validateOffer);

export default router;
