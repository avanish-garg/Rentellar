const { AptosClient, AptosAccount } = require("aptos");

// Aptos Configuration
require("dotenv").config({ path: "./.env" });
const APTOS_NODE_URL = process.env.APTOS_NODE_URL;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

const client = new AptosClient(APTOS_NODE_URL);;

// Function to send Aptos transaction
async function sendAptosTransaction(sender, receiver, amount) {
  try {
    const senderAccount = new AptosAccount();  // In production, use user's private key securely

    const payload = {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [receiver, amount * 1000000], // Convert to Aptos smallest unit
    };

    const txnRequest = await client.generateTransaction(sender, payload);
    const signedTxn = await client.signTransaction(senderAccount, txnRequest);
    const txnResponse = await client.submitTransaction(signedTxn);

    await client.waitForTransaction(txnResponse.hash);
    return txnResponse.hash;
  } catch (error) {
    throw new Error("Aptos transaction failed: " + error.message);
  }
}

module.exports = { sendAptosTransaction };
