import { Networks } from 'stellar-sdk';

export const config = {
  // Network configuration
  networkPassphrase: Networks.TESTNET,
  horizonUrl: 'https://horizon-testnet.stellar.org',
  baseFee: '100',

  // Account configuration
  minimumBalance: '1', // 1 XLM minimum balance
  escrowStartingBalance: '2', // 2 XLM for escrow account

  // Revenue sharing configuration
  ownerShare: 0.9, // 90% to owner
  renterShare: 0.1, // 10% refund to renter
}; 