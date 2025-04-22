const { AptosClient, AptosAccount, Ed25519PrivateKey } = require("aptos");
require("dotenv").config({ path: "./.env" });

const APTOS_NODE_URL = process.env.APTOS_NODE_URL;
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

const client = new AptosClient(APTOS_NODE_URL);

const sendTransaction = async (functionName, args) => {
  try {
    // Create account from private key
    const privateKeyBytes = Buffer.from(OWNER_PRIVATE_KEY, 'hex');
    const account = new AptosAccount(privateKeyBytes);

    // Prepare transaction payload based on function type
    let payload;
    switch (functionName) {
      case "process_payment":
        // Process payment from renter to owner
        payload = {
          function: `${MODULE_ADDRESS}::rental::process_payment`,
          type_arguments: [],
          arguments: [
            args[0], // renter address
            args[1], // owner address
            args[2]  // amount
          ]
        };
        break;

      case "process_refund":
        // Process refund from owner to renter
        payload = {
          function: `${MODULE_ADDRESS}::rental::process_refund`,
          type_arguments: [],
          arguments: [
            args[0], // owner address
            args[1], // renter address
            args[2]  // refund amount
          ]
        };
        break;

      case "create_rental":
        // Create new rental listing
        payload = {
          function: `${MODULE_ADDRESS}::rental::create_rental`,
          type_arguments: [],
          arguments: [
            args[0], // owner
            args[1], // rentAmount
            args[2], // deposit
            args[3], // description
            args[4], // name
            args[5], // category
            args[6], // condition
            args[7], // location
            args[8]  // availableQuantity
          ]
        };
        break;

      case "create_rental_agreement":
        // Create rental agreement
        payload = {
          function: `${MODULE_ADDRESS}::rental::create_rental_agreement`,
          type_arguments: [],
          arguments: [
            args[0], // rentalId
            args[1], // renterAddress
            args[2], // rentAmount
            args[3]  // deposit
          ]
        };
        break;

      case "complete_rental":
        // Complete rental
        payload = {
          function: `${MODULE_ADDRESS}::rental::complete_rental`,
          type_arguments: [],
          arguments: [
            args[0], // rentalId
            args[1], // renterAddress
            args[2], // rentAmount
            args[3]  // deposit
          ]
        };
        break;

      case "cancel_rental":
        // Cancel rental
        payload = {
          function: `${MODULE_ADDRESS}::rental::cancel_rental`,
          type_arguments: [],
          arguments: [
            args[0], // rentalId
            args[1], // renterAddress
            args[2], // rentAmount
            args[3]  // deposit
          ]
        };
        break;

      case "add_penalty":
        // Add penalty
        payload = {
          function: `${MODULE_ADDRESS}::rental::add_penalty`,
          type_arguments: [],
          arguments: [
            args[0], // rentalId
            args[1], // ownerAddress
            args[2]  // penaltyAmount
          ]
        };
        break;

      default:
        throw new Error(`Unknown function: ${functionName}`);
    }

    console.log(`Sending ${functionName} transaction with payload:`, payload);

    // Submit transaction
    const txnRequest = await client.generateTransaction(
      account.address(),
      payload,
      { max_gas_amount: "2000" }
    );

    // Sign and submit transaction
    const signedTxn = await client.signTransaction(account, txnRequest);
    const txnResult = await client.submitTransaction(signedTxn);

    // Wait for transaction to be confirmed
    await client.waitForTransaction(txnResult.hash);

    console.log(`Transaction ${functionName} completed:`, txnResult.hash);
    return { txHash: txnResult.hash };

  } catch (error) {
    console.error(`Error in ${functionName}:`, error);
    throw error;
  }
};

module.exports = sendTransaction;
