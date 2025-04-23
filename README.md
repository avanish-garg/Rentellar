# Rentellar - Stellar-Based Rental Platform

Rentellar is a decentralized rental platform built on the Stellar blockchain that enables users to rent and lend items securely using smart contracts.

## Features

- 🔐 Secure authentication with JWT
- 💰 Stellar blockchain-based payments and deposits
- 📝 Smart contract-based rental agreements
- 📧 Email verification and OTP system
- 🖼️ Image upload for rental items
- 👥 Role-based access (Lender/Renter)
- 🛡️ Rate limiting and security measures
- 📱 Responsive frontend design

## Tech Stack

### Backend
- Node.js with Express and TypeScript
- MongoDB for database
- JWT for authentication
- Stellar SDK for blockchain integration
- Winston for logging
- Multer for file uploads
- Nodemailer for email services

### Frontend
- React.js with TypeScript
- Vite for build tooling
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Context API for state management

## Prerequisites

- Node.js (v18.18 or higher)
- MongoDB
- Stellar testnet account
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rentellar.git
cd rentellar
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Stellar Configuration
STELLAR_NETWORK=TESTNET
ADMIN_SECRET_KEY=your_admin_secret_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
ADMIN_EMAIL=your_admin_email
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Rentals
- POST `/api/rentals/create-listing` - Create a new rental listing
- POST `/api/rentals/book` - Book a rental
- POST `/api/rentals/complete` - Complete a rental
- POST `/api/rentals/cancel` - Cancel a rental
- POST `/api/rentals/addPenalty` - Add penalty to a rental

## Security Features

- Rate limiting on API endpoints
- JWT-based authentication
- Input validation
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- Email verification
- OTP-based rental completion

## Stellar Integration

The platform uses Stellar's blockchain features for:
- Creating escrow accounts for rentals
- Processing rental payments
- Managing security deposits
- Handling refunds
- Multi-signature transactions

## Development

### Frontend Development
The frontend uses Vite with React for fast development:
- Hot Module Replacement (HMR)
- TypeScript support
- ESLint configuration
- Tailwind CSS for styling

### Backend Development
The backend uses TypeScript for better type safety and development experience:
- Strong typing for API responses
- Interface definitions for models
- Type-safe database operations
- Stellar SDK integration with TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stellar Development Foundation
- MongoDB Atlas
- All contributors and maintainers
