import dotenv from 'dotenv';
import { Networks } from 'stellar-sdk';
import { config } from '../config/stellar.config';

// Load environment variables
dotenv.config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/rentellar-test';

// Configure Stellar test network
config.networkPassphrase = Networks.TESTNET;
config.horizonUrl = 'https://horizon-testnet.stellar.org'; 