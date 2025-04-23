import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { RentalProvider } from './context/RentalContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rentals from './pages/Rentals';
import CreateRental from './pages/CreateRental';
import RentalDetails from './pages/RentalDetails';
import Profile from './pages/Profile';
import './App.css';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <RentalProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/rentals/create" element={<CreateRental />} />
                <Route path="/rentals/:id" element={<RentalDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </RentalProvider>
    </WalletProvider>
  );
};

export default App; 