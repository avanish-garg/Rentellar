const mongoose = require('mongoose');
const Rental = require('../models/Rental');
require('dotenv').config({ path: './.env' });

const sampleRentals = [
  {
    name: "Professional DSLR Camera",
    description: "High-end DSLR camera perfect for photography enthusiasts and professionals. Includes basic accessories.",
    rentAmount: 5000,
    deposit: 1500,
    category: "Electronics",
    condition: "Like New",
    location: "Mumbai",
    availableQuantity: 2,
    owner: "0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b",
    image: "uploads/1742906222416.jpg",
    blockchainTxHash: "0x1234567890abcdef",
    status: "Created",
    tokenId: "1"
  },
  {
    name: "Mountain Bike",
    description: "All-terrain mountain bike suitable for both beginners and experienced riders. Includes safety gear.",
    rentAmount: 3000,
    deposit: 800,
    category: "Sports",
    condition: "Good",
    location: "Delhi",
    availableQuantity: 1,
    owner: "0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b",
    image: "uploads/1742906064284.jpg",
    blockchainTxHash: "0xabcdef1234567890",
    status: "Created",
    tokenId: "2"
  },
  {
    name: "Gaming Console",
    description: "Latest gaming console with 2 controllers and popular games included.",
    rentAmount: 4000,
    deposit: 1000,
    category: "Electronics",
    condition: "New",
    location: "Bangalore",
    availableQuantity: 3,
    owner: "0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b",
    image: "uploads/1742906222416.jpg",
    blockchainTxHash: "0x7890abcdef123456",
    status: "Created",
    tokenId: "3"
  },
  {
    name: "Camping Tent",
    description: "4-person camping tent with all necessary accessories. Perfect for weekend getaways.",
    rentAmount: 2000,
    deposit: 500,
    category: "Sports",
    condition: "Good",
    location: "Pune",
    availableQuantity: 2,
    owner: "0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b",
    image: "uploads/1742906064284.jpg",
    blockchainTxHash: "0x4567890abcdef123",
    status: "Created",
    tokenId: "4"
  },
  {
    name: "DJ Equipment Set",
    description: "Complete DJ setup including mixer, speakers, and basic lighting. Great for small events.",
    rentAmount: 10000,
    deposit: 3000,
    category: "Electronics",
    condition: "Like New",
    location: "Mumbai",
    availableQuantity: 1,
    owner: "0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b",
    image: "uploads/1742906222416.jpg",
    blockchainTxHash: "0xdef1234567890abc",
    status: "Created",
    tokenId: "5"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing rentals
    await Rental.deleteMany({});
    console.log('Cleared existing rentals');

    // Insert sample rentals one by one
    for (const rentalData of sampleRentals) {
      const rental = new Rental(rentalData);
      await rental.save();
      console.log(`Added rental: ${rental.name}`);
    }

    console.log('Successfully added all rental listings');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 