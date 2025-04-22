import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { publicKey } = req.body;

        if (!publicKey) {
            return res.status(400).json({ message: 'Public key is required' });
        }

        // Check if wallet already exists
        const existingWallet = await prisma.wallet.findUnique({
            where: { publicKey }
        });

        if (existingWallet) {
            return res.status(400).json({ message: 'Wallet already registered' });
        }

        // Create new wallet
        const wallet = await prisma.wallet.create({
            data: {
                publicKey,
                role: 'USER' // Default role
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { publicKey: wallet.publicKey },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Wallet registered successfully',
            token,
            wallet: {
                publicKey: wallet.publicKey,
                role: wallet.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { publicKey } = req.body;

        if (!publicKey) {
            return res.status(400).json({ message: 'Public key is required' });
        }

        // Find wallet
        const wallet = await prisma.wallet.findUnique({
            where: { publicKey }
        });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { publicKey: wallet.publicKey },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            wallet: {
                publicKey: wallet.publicKey,
                role: wallet.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 