import { Router } from 'express';
import { StellarService } from '../services/stellarService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();
const stellarService = new StellarService();

// Create a new rental
router.post('/', async (req, res, next) => {
  try {
    const { title, description, pricePerDay, securityDeposit, imageUrl, owner } = req.body;

    if (!title || !description || !pricePerDay || !securityDeposit || !owner) {
      throw new AppError(400, 'Missing required fields');
    }

    const escrowAccount = await stellarService.createEscrowAccount(owner);
    
    res.status(201).json({
      message: 'Rental created successfully',
      escrowAccount: escrowAccount.publicKey()
    });
  } catch (error) {
    next(error);
  }
});

// Process rental payment
router.post('/:id/payment', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { renter, amount } = req.body;

    if (!renter || !amount) {
      throw new AppError(400, 'Missing required fields');
    }

    await stellarService.processRentalPayment(renter, amount);
    
    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    next(error);
  }
});

// Complete rental
router.post('/:id/complete', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { owner, renter } = req.body;

    if (!owner || !renter) {
      throw new AppError(400, 'Missing required fields');
    }

    await stellarService.completeRental(owner, renter);
    
    res.json({ message: 'Rental completed successfully' });
  } catch (error) {
    next(error);
  }
});

// Cancel rental
router.post('/:id/cancel', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { owner, renter } = req.body;

    if (!owner || !renter) {
      throw new AppError(400, 'Missing required fields');
    }

    await stellarService.cancelRental(owner, renter);
    
    res.json({ message: 'Rental cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

export const rentalRoutes = router; 