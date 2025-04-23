import { Keypair, Operation, TransactionBuilder, Asset } from 'stellar-sdk';
const { Server } = require('stellar-sdk');
import { config } from '../config/stellar.config';

export class StellarService {
  private server: any;

  constructor() {
    this.server = new Server(config.horizonUrl);
  }

  async createEscrowAccount(ownerPublicKey: string, renterPublicKey: string): Promise<string> {
    try {
      const escrowKeypair = Keypair.random();
      const sourceAccount = await this.server.loadAccount(ownerPublicKey);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: config.baseFee,
        networkPassphrase: config.networkPassphrase,
      })
        .addOperation(Operation.createAccount({
          destination: escrowKeypair.publicKey(),
          startingBalance: config.escrowStartingBalance,
        }))
        .addOperation(Operation.setOptions({
          source: escrowKeypair.publicKey(),
          masterWeight: 0,
          lowThreshold: 2,
          medThreshold: 2,
          highThreshold: 2,
          signer: {
            ed25519PublicKey: ownerPublicKey,
            weight: 1,
          },
        }))
        .addOperation(Operation.setOptions({
          source: escrowKeypair.publicKey(),
          signer: {
            ed25519PublicKey: renterPublicKey,
            weight: 1,
          },
        }))
        .setTimeout(30)
        .build();

      transaction.sign(escrowKeypair);
      await this.server.submitTransaction(transaction);
      return escrowKeypair.publicKey();
    } catch (error) {
      console.error('Error creating escrow account:', error);
      throw error;
    }
  }

  async processRentalPayment(renterKeypair: Keypair, escrowPublicKey: string, amount: string): Promise<void> {
    try {
      const sourceAccount = await this.server.loadAccount(renterKeypair.publicKey());

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: config.baseFee,
        networkPassphrase: config.networkPassphrase,
      })
        .addOperation(Operation.payment({
          destination: escrowPublicKey,
          asset: Asset.native(),
          amount: amount,
        }))
        .setTimeout(30)
        .build();

      transaction.sign(renterKeypair);
      await this.server.submitTransaction(transaction);
    } catch (error) {
      console.error('Error processing rental payment:', error);
      throw error;
    }
  }

  async completeRental(
    ownerKeypair: Keypair,
    renterKeypair: Keypair,
    escrowPublicKey: string,
    totalAmount: string
  ): Promise<void> {
    try {
      const escrowAccount = await this.server.loadAccount(escrowPublicKey);
      const ownerAmount = (parseFloat(totalAmount) * config.ownerShare).toFixed(7);
      const renterAmount = (parseFloat(totalAmount) * config.renterShare).toFixed(7);

      const transaction = new TransactionBuilder(escrowAccount, {
        fee: config.baseFee,
        networkPassphrase: config.networkPassphrase,
      })
        .addOperation(Operation.payment({
          destination: ownerKeypair.publicKey(),
          asset: Asset.native(),
          amount: ownerAmount,
        }))
        .addOperation(Operation.payment({
          destination: renterKeypair.publicKey(),
          asset: Asset.native(),
          amount: renterAmount,
        }))
        .addOperation(Operation.accountMerge({
          destination: ownerKeypair.publicKey(),
        }))
        .setTimeout(30)
        .build();

      transaction.sign(ownerKeypair, renterKeypair);
      await this.server.submitTransaction(transaction);
    } catch (error) {
      console.error('Error completing rental:', error);
      throw error;
    }
  }

  async getBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const balance = account.balances.find(
        (b: any) => b.asset_type === 'native'
      );
      return balance ? balance.balance : '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async cancelRental(
    ownerKeypair: Keypair,
    renterKeypair: Keypair,
    escrowPublicKey: string,
    amount: string
  ): Promise<void> {
    try {
      const escrowAccount = await this.server.loadAccount(escrowPublicKey);

      const transaction = new TransactionBuilder(escrowAccount, {
        fee: config.baseFee,
        networkPassphrase: config.networkPassphrase,
      })
        .addOperation(Operation.payment({
          destination: renterKeypair.publicKey(),
          asset: Asset.native(),
          amount: amount,
        }))
        .addOperation(Operation.accountMerge({
          destination: ownerKeypair.publicKey(),
        }))
        .setTimeout(30)
        .build();

      transaction.sign(ownerKeypair, renterKeypair);
      await this.server.submitTransaction(transaction);
    } catch (error) {
      console.error('Error canceling rental:', error);
      throw error;
    }
  }
} 