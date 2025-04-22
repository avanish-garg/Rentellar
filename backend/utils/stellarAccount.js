const StellarSdk = require('stellar-sdk');
const axios = require('axios');
require('dotenv').config({ path: "./.env" });

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const STELLAR_SERVER = new StellarSdk.Server(
  STELLAR_NETWORK === 'testnet' 
    ? 'https://horizon-testnet.stellar.org' 
    : 'https://horizon.stellar.org'
);

// Create a new Stellar account
async function createStellarAccount() {
  const pair = StellarSdk.Keypair.random();
  
  if (STELLAR_NETWORK === 'testnet') {
    try {
      // Fund the account using Friendbot (testnet only)
      await axios.get(`https://friendbot.stellar.org?addr=${pair.publicKey()}`);
      console.log('Account funded with testnet XLM');
    } catch (error) {
      throw new Error('Error funding testnet account: ' + error.message);
    }
  }

  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret()
  };
}

// Create a custom asset
async function createCustomAsset(assetCode, issuerSecret) {
  const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecret);
  const asset = new StellarSdk.Asset(assetCode, issuerKeypair.publicKey());
  return asset;
}

// Set up trust line for custom asset
async function setupTrustline(recipientSecret, assetCode, issuerPublicKey) {
  try {
    const recipientKeypair = StellarSdk.Keypair.fromSecret(recipientSecret);
    const account = await STELLAR_SERVER.loadAccount(recipientKeypair.publicKey());
    
    const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_NETWORK === 'testnet' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: asset,
        limit: '1000000' // Maximum amount they can hold
      })
    )
    .setTimeout(30)
    .build();

    transaction.sign(recipientKeypair);
    const result = await STELLAR_SERVER.submitTransaction(transaction);
    return result;
  } catch (error) {
    throw new Error('Error setting up trustline: ' + error.message);
  }
}

// Create an escrow account
async function createEscrowAccount(ownerSecret) {
  try {
    const ownerKeypair = StellarSdk.Keypair.fromSecret(ownerSecret);
    const escrowKeypair = StellarSdk.Keypair.random();
    
    // Fund the escrow account
    const account = await STELLAR_SERVER.loadAccount(ownerKeypair.publicKey());
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_NETWORK === 'testnet' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: escrowKeypair.publicKey(),
        startingBalance: '2.5' // Minimum balance + transaction fees
      })
    )
    .setTimeout(30)
    .build();

    transaction.sign(ownerKeypair);
    
    const result = await STELLAR_SERVER.submitTransaction(transaction);
    return {
      publicKey: escrowKeypair.publicKey(),
      secretKey: escrowKeypair.secret(),
      transactionResult: result
    };
  } catch (error) {
    throw new Error('Error creating escrow account: ' + error.message);
  }
}

// Check account balance
async function checkBalance(publicKey) {
  try {
    const account = await STELLAR_SERVER.loadAccount(publicKey);
    const balances = account.balances.map(balance => ({
      asset: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
      balance: balance.balance
    }));
    return balances;
  } catch (error) {
    throw new Error('Error checking balance: ' + error.message);
  }
}

module.exports = {
  createStellarAccount,
  createCustomAsset,
  setupTrustline,
  createEscrowAccount,
  checkBalance
}; 