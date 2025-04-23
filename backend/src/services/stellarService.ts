import { Keypair, TransactionBuilder, Operation, Asset, Networks, BASE_FEE } from 'stellar-sdk';
import { Server } from 'stellar-sdk';
import { config } from '../config/stellar.config';
import { logger } from '../utils/logger';

export class StellarService {
  private server: any;
  private networkPassphrase: string;

  constructor() {
    this.server = new Server(config.horizonUrl);
    this.networkPassphrase = config.networkPassphrase;
  }

  async createEscrowAccount(ownerPublicKey: string): Promise<Keypair> {
    try {
      const escrowKeypair = Keypair.random();
      const ownerAccount = await this.server.loadAccount(ownerPublicKey);

      const transaction = new TransactionBuilder(ownerAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.createAccount({
            destination: escrowKeypair.publicKey(),
            startingBalance: config.escrowStartingBalance,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(Keypair.fromSecret(ownerAccount.secretKey));
      await this.server.submitTransaction(transaction);

      return escrowKeypair;
    } catch (error) {
      logger.error('Error creating escrow account:', error);
      throw new Error('Failed to create escrow account');
    }
  }

  async processRentalPayment(renterPublicKey: string, amount: string): Promise<void> {
    try {
      const renterAccount = await this.server.loadAccount(renterPublicKey);
      const escrowAccount = await this.server.loadAccount(config.escrowAccount.publicKey);

      const transaction = new TransactionBuilder(renterAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: escrowAccount.publicKey(),
            asset: Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(Keypair.fromSecret(renterAccount.secretKey));
      await this.server.submitTransaction(transaction);
    } catch (error) {
      logger.error('Error processing rental payment:', error);
      throw new Error('Failed to process rental payment');
    }
  }

  async completeRental(ownerPublicKey: string, renterPublicKey: string): Promise<void> {
    try {
      const escrowAccount = await this.server.loadAccount(config.escrowAccount.publicKey);
      const ownerAccount = await this.server.loadAccount(ownerPublicKey);

      const transaction = new TransactionBuilder(escrowAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: ownerPublicKey,
            asset: Asset.native(),
            amount: '0.5', // Half of the escrow amount
          })
        )
        .addOperation(
          Operation.payment({
            destination: renterPublicKey,
            asset: Asset.native(),
            amount: '0.5', // Half of the escrow amount
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(Keypair.fromSecret(config.escrowAccount.secretKey));
      await this.server.submitTransaction(transaction);
    } catch (error) {
      logger.error('Error completing rental:', error);
      throw new Error('Failed to complete rental');
    }
  }

  async cancelRental(ownerPublicKey: string, renterPublicKey: string): Promise<void> {
    try {
      const escrowAccount = await this.server.loadAccount(config.escrowAccount.publicKey);
      const ownerAccount = await this.server.loadAccount(ownerPublicKey);

      const transaction = new TransactionBuilder(escrowAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: ownerPublicKey,
            asset: Asset.native(),
            amount: '1', // Return full amount to owner
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(Keypair.fromSecret(config.escrowAccount.secretKey));
      await this.server.submitTransaction(transaction);
    } catch (error) {
      logger.error('Error canceling rental:', error);
      throw new Error('Failed to cancel rental');
    }
  }

  async getBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const balance = account.balances.find((b: any) => b.asset_type === 'native');
      return balance ? balance.balance : '0';
    } catch (error) {
      logger.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  }
} 