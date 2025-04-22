import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Wallet } from 'lucide-react';

const FrontNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const { user, logout } = useUser();
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Theme colors - Emerald/Green
  const theme = {
    primary: "#10B981", // emerald-500
    primaryHover: "#059669", // emerald-600
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add animation class when component mounts
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Slight delay for better entrance effect
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Navigate functions
  const handleSignupClick = () => navigate("/signup");
  const handleLoginClick = () => navigate("/login");
  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };
  const goToProfile = () => navigate("/profile");
  const handleListItemClick = () => {
    if (isAuthenticated) {
      navigate("/add-rental");
    } else {
      navigate("/login");
    }
  };

  // Function to connect to Petra Wallet
  const connectWallet = async () => {
    if (window.aptos) {
      try {
        const response = await window.aptos.connect();
        setWalletAddress(response.address);
      } catch (error) {
        console.error("Error connecting to Petra Wallet:", error);
      }
    } else {
      alert("Petra Wallet is not installed. Please install it to use this feature.");
    }
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-black/90 backdrop-blur-md py-2 shadow-lg" 
          : "bg-gradient-to-b from-black/70 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with fade-in animation */}
          <Link 
            to="/" 
            className={`flex items-center group transform transition-all duration-700 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight transition-all duration-300 hover:scale-105">
              <span 
                className="text-emerald-400 transition-all duration-300 group-hover:tracking-wider"
                style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
              >
                Apto
              </span>
              <span className="group-hover:text-gray-300 transition-colors duration-300">rent</span>
            </h1>
          </Link>

          {/* Navigation Links with staggered fade-in */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", path: "/", delay: 100 },
              { name: "Listings", path: "/categories", delay: 200 },
              { name: "Education", path: "/education", delay: 300 },
              { name: "Contact", path: "/contact", delay: 400 },
              { name: "About", path: "/about", delay: 500 },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-white/90 hover:text-white px-3 py-2 text-sm font-medium relative group transform transition-all duration-700 ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: mounted ? `${item.delay}ms` : '0ms' }}
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons, Cart, and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-white/90 hover:text-white">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Wallet Connection */}
            <button
              onClick={connectWallet}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span>{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}</span>
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={handleListItemClick}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  List Item
                </button>
                <button
                  onClick={goToProfile}
                  className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FrontNavbar; 