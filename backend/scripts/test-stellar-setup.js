const { 
  createStellarAccount, 
  checkBalance 
} = require('../utils/stellarAccount');
const RentalContract = require('../utils/rentalContract');

async function testStellarSetup() {
  try {
    console.log('🚀 Testing Stellar Setup...\n');

    // 1. Create owner account
    console.log('1. Creating owner account...');
    const owner = await createStellarAccount();
    console.log('Owner account created:');
    console.log('Public Key:', owner.publicKey);
    console.log('Secret Key:', owner.secretKey);
    
    // Check owner balance
    console.log('\nChecking owner balance...');
    const ownerBalance = await checkBalance(owner.publicKey);
    console.log('Owner balance:', ownerBalance);

    // 2. Create renter account
    console.log('\n2. Creating renter account...');
    const renter = await createStellarAccount();
    console.log('Renter account created:');
    console.log('Public Key:', renter.publicKey);
    console.log('Secret Key:', renter.secretKey);
    
    // Check renter balance
    console.log('\nChecking renter balance...');
    const renterBalance = await checkBalance(renter.publicKey);
    console.log('Renter balance:', renterBalance);

    // 3. Create and initialize rental contract
    console.log('\n3. Creating rental contract...');
    const contract = new RentalContract(owner.secretKey, renter.publicKey);
    const escrowAccount = await contract.initialize('10', '20');
    console.log('Rental contract created with escrow account:');
    console.log('Escrow Public Key:', escrowAccount.publicKey);

    // 4. Process rental payment
    console.log('\n4. Processing rental payment...');
    const paymentResult = await contract.processPayment(renter.secretKey, '10', '20');
    console.log('Payment processed:', paymentResult.hash);

    // Check balances after payment
    console.log('\nChecking balances after payment...');
    const ownerBalanceAfterPayment = await checkBalance(owner.publicKey);
    const renterBalanceAfterPayment = await checkBalance(renter.publicKey);
    const escrowBalanceAfterPayment = await checkBalance(escrowAccount.publicKey);
    
    console.log('Owner balance:', ownerBalanceAfterPayment);
    console.log('Renter balance:', renterBalanceAfterPayment);
    console.log('Escrow balance:', escrowBalanceAfterPayment);

    // 5. Complete rental and return deposit
    console.log('\n5. Completing rental...');
    const completionResult = await contract.completeRental(owner.secretKey, renter.publicKey);
    console.log('Rental completed:', completionResult.hash);

    // Check final balances
    console.log('\nChecking final balances...');
    const ownerBalanceFinal = await checkBalance(owner.publicKey);
    const renterBalanceFinal = await checkBalance(renter.publicKey);
    
    console.log('Final owner balance:', ownerBalanceFinal);
    console.log('Final renter balance:', renterBalanceFinal);
    console.log('Escrow account has been merged (no longer exists)');

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
console.log('Starting Stellar setup test...');
testStellarSetup().catch(console.error); 