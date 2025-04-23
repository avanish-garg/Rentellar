const StellarSdk = require('stellar-sdk');
const { sendStellarTransaction } = require('./stellarHelper');
require('dotenv').config({ path: "./.env" });

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const STELLAR_SERVER = new StellarSdk.Server(
  STELLAR_NETWORK === 'testnet' 
    ? 'https://horizon-testnet.stellar.org' 
    : 'https://horizon.stellar.org'
);

const sendTransaction = async (functionName, args) => {
  try {
    // Get source account from environment
    const sourceSecret = process.env.OWNER_PRIVATE_KEY;
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
    const sourceAccount = await STELLAR_SERVER.loadAccount(sourceKeypair.publicKey());

    // Prepare transaction based on function type
    let transaction;
    switch (functionName) {
      case "process_payment":
        // Process payment from renter to owner
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: STELLAR_NETWORK === 'testnet' 
            ? StellarSdk.Networks.TESTNET 
            : StellarSdk.Networks.PUBLIC
        })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: args[1], // owner address
            asset: StellarSdk.Asset.native(),
            amount: args[2].toString() // amount
          })
        )
        .setTimeout(30)
        .build();
        break;

      case "process_refund":
        // Process refund from owner to renter
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: STELLAR_NETWORK === 'testnet' 
            ? StellarSdk.Networks.TESTNET 
            : StellarSdk.Networks.PUBLIC
        })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: args[1], // renter address
            asset: StellarSdk.Asset.native(),
            amount: args[2].toString() // refund amount
          })
        )
        .setTimeout(30)
        .build();
        break;

      case "add_penalty":
        // Add penalty
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: STELLAR_NETWORK === 'testnet' 
            ? StellarSdk.Networks.TESTNET 
            : StellarSdk.Networks.PUBLIC
        })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: args[1], // owner address
            asset: StellarSdk.Asset.native(),
            amount: args[2].toString() // penalty amount
          })
        )
        .setTimeout(30)
        .build();
        break;

      default:
        throw new Error(`Unknown function: ${functionName}`);
    }

    console.log(`Sending ${functionName} transaction`);

    // Sign and submit transaction
    transaction.sign(sourceKeypair);
    const response = await STELLAR_SERVER.submitTransaction(transaction);

    console.log(`Transaction ${functionName} completed:`, response.hash);
    return { txHash: response.hash };

  } catch (error) {
    console.error(`Error in ${functionName}:`, error);
    throw error;
  }
};

module.exports = sendTransaction;
