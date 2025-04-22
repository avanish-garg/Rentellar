const StellarSdk = require('stellar-sdk');
require('dotenv').config({ path: "./.env" });

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const STELLAR_SERVER = new StellarSdk.Server(
  STELLAR_NETWORK === 'testnet' 
    ? 'https://horizon-testnet.stellar.org' 
    : 'https://horizon.stellar.org'
);

// Function to send Stellar transaction
async function sendStellarTransaction(sourceSecret, destinationAddress, amount, assetCode = 'XLM') {
  try {
    // Create source account from secret
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
    const sourceAccount = await STELLAR_SERVER.loadAccount(sourceKeypair.publicKey());

    // Create transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_NETWORK === 'testnet' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    });

    // Add payment operation
    transaction.addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: assetCode === 'XLM' 
          ? StellarSdk.Asset.native() 
          : new StellarSdk.Asset(assetCode, process.env.ISSUER_ADDRESS),
        amount: amount.toString()
      })
    );

    // Set timeout and build transaction
    transaction.setTimeout(30);
    const builtTransaction = transaction.build();

    // Sign transaction
    builtTransaction.sign(sourceKeypair);

    // Submit transaction
    const response = await STELLAR_SERVER.submitTransaction(builtTransaction);
    return response.hash;
  } catch (error) {
    throw new Error("Stellar transaction failed: " + error.message);
  }
}

module.exports = { sendStellarTransaction }; 