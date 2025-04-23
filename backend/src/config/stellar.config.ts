import { Networks } from 'stellar-sdk';

export const config = {
  networkPassphrase: Networks.TESTNET,
  horizonUrl: 'https://horizon-testnet.stellar.org',
  baseFee: '100', // 0.00001 XLM
  minimumBalance: '1', // 1 XLM
  escrowStartingBalance: '2', // 2 XLM
  // Percentage splits for rental completion
  ownerShare: 0.5, // 50% to owner
  renterShare: 0.5, // 50% refund to renter
  escrowAccount: {
    publicKey: process.env.ESCROW_PUBLIC_KEY || '',
    secretKey: process.env.ESCROW_SECRET_KEY || ''
  }
}; 