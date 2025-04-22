const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_URL = 'http://localhost:5001/api';
let authToken = '';
let createdRentalId = '';

// Test user credentials
const testUser = {
    email: 'test2@example.com',
    password: 'Test123!',
    username: 'testuser2',
    name: 'Test User 2',
    role: 'lender',
    address: '0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b'
};

// Test rental data
const testRental = {
    name: 'Test Item',
    description: 'Test Description',
    rentAmount: '10',
    deposit: '20',
    category: 'Electronics',
    condition: 'New',
    location: 'Test Location',
    availableQuantity: '1',
    ownerAddress: process.env.ADMIN_WALLET_ADDRESS || testUser.address
};

// Create a test image file
const createTestImage = () => {
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    const imageData = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'); // 1x1 transparent GIF
    fs.writeFileSync(testImagePath, imageData);
    return testImagePath;
};

async function registerAndLogin() {
    try {
        console.log('\n1. Testing User Registration...');
        const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('✅ Registration successful');

        console.log('\n2. Testing User Login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginResponse.data.token;
        console.log('✅ Login successful');
        return loginResponse.data;
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.includes('already exists')) {
            // If user exists, just login
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            authToken = loginResponse.data.token;
            console.log('✅ Login successful (existing user)');
            return loginResponse.data;
        } else {
            console.error('❌ Auth Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

async function testCreateListing() {
    try {
        console.log('\n3. Testing Create Rental Listing...');
        const formData = new FormData();
        
        // Create and append test image
        const testImagePath = createTestImage();
        formData.append('image', fs.createReadStream(testImagePath));
        
        // Add rental data
        Object.entries(testRental).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await axios.post(
            `${API_URL}/rentals/create-listing`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    ...formData.getHeaders()
                }
            }
        );
        
        // Clean up test image
        fs.unlinkSync(testImagePath);
        
        createdRentalId = response.data.data.rental._id;
        console.log('✅ Create listing successful');
        console.log('Transaction Hash:', response.data.data.transactionHash);
        return response.data;
    } catch (error) {
        console.error('❌ Create Listing Error:', error.response?.data || error.message);
        throw error;
    }
}

async function testBookRental() {
    try {
        console.log('\n4. Testing Book Rental...');
        const response = await axios.post(
            `${API_URL}/rentals/book`,
            {
                rentalId: createdRentalId,
                rentAmount: testRental.rentAmount,
                deposit: testRental.deposit
            },
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
        console.log('✅ Book rental successful');
        console.log('Payment Transaction Hash:', response.data.data.paymentTxHash);
        console.log('Agreement Transaction Hash:', response.data.data.agreementTxHash);
        return response.data;
    } catch (error) {
        console.error('❌ Book Rental Error:', error.response?.data || error.message);
        throw error;
    }
}

async function testAddPenalty() {
    try {
        console.log('\n5. Testing Add Penalty...');
        const response = await axios.post(
            `${API_URL}/rentals/addPenalty`,
            {
                rentalId: createdRentalId,
                penaltyAmount: '5'
            },
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
        console.log('✅ Add penalty successful');
        console.log('Transaction Hash:', response.data.transactionHash);
        return response.data;
    } catch (error) {
        console.error('❌ Add Penalty Error:', error.response?.data || error.message);
        throw error;
    }
}

async function testCompleteRental() {
    try {
        console.log('\n6. Testing Complete Rental...');
        const response = await axios.post(
            `${API_URL}/rentals/complete`,
            {
                rentalId: createdRentalId,
                otp: '123456' // This should match the OTP sent in email
            },
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
        console.log('✅ Complete rental successful');
        console.log('Refund Transaction Hash:', response.data.refundTxHash);
        console.log('Complete Transaction Hash:', response.data.completeTxHash);
        return response.data;
    } catch (error) {
        console.error('❌ Complete Rental Error:', error.response?.data || error.message);
        throw error;
    }
}

async function testCancelRental() {
    try {
        console.log('\n7. Testing Cancel Rental...');
        const response = await axios.post(
            `${API_URL}/rentals/cancel`,
            {
                rentalId: createdRentalId
            },
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
        console.log('✅ Cancel rental successful');
        console.log('Transaction Hash:', response.data.transactionHash);
        return response.data;
    } catch (error) {
        console.error('❌ Cancel Rental Error:', error.response?.data || error.message);
        throw error;
    }
}

async function runTests() {
    try {
        console.log('🚀 Starting Blockchain API Tests...');
        
        // Auth flow
        console.log('\nTesting authentication...');
        const authData = await registerAndLogin();
        console.log('User authenticated with wallet:', authData.user.address);
        
        // Create and test rental
        console.log('\nTesting rental creation...');
        const rental = await testCreateListing();
        console.log('Created Rental ID:', createdRentalId);
        
        // Test rental operations
        console.log('\nTesting rental operations...');
        await testBookRental();
        await testAddPenalty();
        await testCompleteRental();
        
        // Create another rental for cancel test
        console.log('\nTesting rental cancellation...');
        const rental2 = await testCreateListing();
        await testBookRental();
        await testCancelRental();
        
        console.log('\n✨ All blockchain API tests completed successfully!');
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        process.exit(1);
    }
}

// Run the test suite
console.log('Starting test suite...');
runTests().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 