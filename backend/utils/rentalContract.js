const StellarSdk = require('stellar-sdk');
require('dotenv').config({ path: "./.env" });
const { createEscrowAccount } = require('./stellarAccount');

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const STELLAR_SERVER = new StellarSdk.Server(
  STELLAR_NETWORK === 'testnet' 
    ? 'https://horizon-testnet.stellar.org' 
    : 'https://horizon.stellar.org'
);

class RentalContract {
  constructor(ownerSecret, renterPublicKey) {
    this.ownerSecret = ownerSecret;
    this.renterPublicKey = renterPublicKey;
  }

  // Initialize rental contract by creating escrow account
  async initialize(rentAmount, deposit) {
    try {
      // Create escrow account
      const escrowAccount = await createEscrowAccount(this.ownerSecret);
      
      this.escrowPublicKey = escrowAccount.publicKey;
      this.escrowSecret = escrowAccount.secretKey;
      
      return escrowAccount;
    } catch (error) {
      throw new Error('Error initializing rental contract: ' + error.message);
    }
  }

  // Process rental payment and deposit
  async processPayment(renterSecret, rentAmount, deposit) {
    try {
      const renterKeypair = StellarSdk.Keypair.fromSecret(renterSecret);
      const renterAccount = await STELLAR_SERVER.loadAccount(renterKeypair.publicKey());
      
      // Create transaction for rent and deposit payment
      const transaction = new StellarSdk.TransactionBuilder(renterAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK === 'testnet' 
          ? StellarSdk.Networks.TESTNET 
          : StellarSdk.Networks.PUBLIC
      })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: this.escrowPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: deposit.toString()
        })
      )
      .addOperation(
        StellarSdk.Operation.payment({
          destination: StellarSdk.Keypair.fromSecret(this.ownerSecret).publicKey(),
          asset: StellarSdk.Asset.native(),
          amount: rentAmount.toString()
        })
      )
      .setTimeout(30)
      .build();

      transaction.sign(renterKeypair);
      const result = await STELLAR_SERVER.submitTransaction(transaction);
      return result;
    } catch (error) {
      throw new Error('Error processing payment: ' + error.message);
    }
  }

  // Complete rental and return deposit
  async completeRental(ownerSecret, renterPublicKey) {
    try {
      const escrowAccount = await STELLAR_SERVER.loadAccount(this.escrowPublicKey);
      
      // Create transaction to merge escrow account into renter's account
      const transaction = new StellarSdk.TransactionBuilder(escrowAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK === 'testnet' 
          ? StellarSdk.Networks.TESTNET 
          : StellarSdk.Networks.PUBLIC
      })
      .addOperation(
        StellarSdk.Operation.accountMerge({
          destination: renterPublicKey
        })
      )
      .setTimeout(30)
      .build();

      // Sign with escrow account
      const escrowKeypair = StellarSdk.Keypair.fromSecret(this.escrowSecret);
      transaction.sign(escrowKeypair);
      
      const result = await STELLAR_SERVER.submitTransaction(transaction);
      return result;
    } catch (error) {
      throw new Error('Error completing rental: ' + error.message);
    }
  }

  // Process penalty by sending part of deposit to owner
  async processPenalty(ownerSecret, renterPublicKey, penaltyAmount) {
    try {
      const escrowAccount = await STELLAR_SERVER.loadAccount(this.escrowPublicKey);
      
      // Create transaction for penalty payment
      const transaction = new StellarSdk.TransactionBuilder(escrowAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK === 'testnet' 
          ? StellarSdk.Networks.TESTNET 
          : StellarSdk.Networks.PUBLIC
      })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: StellarSdk.Keypair.fromSecret(ownerSecret).publicKey(),
          asset: StellarSdk.Asset.native(),
          amount: penaltyAmount.toString()
        })
      )
      .addOperation(
        StellarSdk.Operation.accountMerge({
          destination: renterPublicKey
        })
      )
      .setTimeout(30)
      .build();

      // Sign with escrow account
      const escrowKeypair = StellarSdk.Keypair.fromSecret(this.escrowSecret);
      transaction.sign(escrowKeypair);
      
      const result = await STELLAR_SERVER.submitTransaction(transaction);
      return result;
    } catch (error) {
      throw new Error('Error processing penalty: ' + error.message);
    }
  }
}

module.exports = RentalContract; 