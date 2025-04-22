import { Request, Response } from 'express';

export const getRentals = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Temporary response until we implement the database
        res.json({ message: 'Protected rental routes', rentals: [] });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}; 