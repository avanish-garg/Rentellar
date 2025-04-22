import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import rentalRoutes from './routes/rentalRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 