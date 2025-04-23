import { Keypair, Asset, Networks, TransactionBuilder, Operation } from 'stellar-sdk';
import Server from 'stellar-sdk';
import { config } from '../config/stellar.config';
import { describe, beforeAll, it, expect } from '@jest/globals';

interface Balance {
  asset_type: string;
  balance: string;
}

describe('Stellar Integration Tests', () => {
  let server: any;
  let ownerKeypair: Keypair;
  let renterKeypair: Keypair;
  let escrowKeypair: Keypair;

  beforeAll(async () => {
    server = new Server(config.horizonUrl);
    ownerKeypair = Keypair.random();
    renterKeypair = Keypair.random();

    // Fund test accounts using friendbot
    await Promise.all([
      fetch(`https://friendbot.stellar.org?addr=${ownerKeypair.publicKey()}`),
      fetch(`https://friendbot.stellar.org?addr=${renterKeypair.publicKey()}`),
    ]);
  });

  it('should create and fund test accounts', async () => {
    const ownerAccount = await server.loadAccount(ownerKeypair.publicKey());
    const renterAccount = await server.loadAccount(renterKeypair.publicKey());

    expect(ownerAccount).toBeDefined();
    expect(renterAccount).toBeDefined();
  });

  it('should create an escrow account', async () => {
    escrowKeypair = Keypair.random();
    const ownerAccount = await server.loadAccount(ownerKeypair.publicKey());

    const transaction = new TransactionBuilder(ownerAccount, {
      fee: config.baseFee,
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(
        Operation.createAccount({
          destination: escrowKeypair.publicKey(),
          startingBalance: config.escrowStartingBalance,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(ownerKeypair);
    await server.submitTransaction(transaction);

    const escrowAccount = await server.loadAccount(escrowKeypair.publicKey());
    expect(escrowAccount).toBeDefined();
  });

  it('should process rental payment to escrow', async () => {
    const renterAccount = await server.loadAccount(renterKeypair.publicKey());
    const rentalAmount = '1';

    const transaction = new TransactionBuilder(renterAccount, {
      fee: config.baseFee,
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: escrowKeypair.publicKey(),
          asset: Asset.native(),
          amount: rentalAmount,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(renterKeypair);
    await server.submitTransaction(transaction);

    const escrowAccount = await server.loadAccount(escrowKeypair.publicKey());
    const balance = escrowAccount.balances.find((b: Balance) => b.asset_type === 'native');
    expect(parseFloat(balance?.balance || '0')).toBeGreaterThan(1);
  });
}); 