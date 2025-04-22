import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useCart } from '../context/CartContext';
import FrontNavbar from "../components/FrontNavbar";

// Dark theme colors (same as other pages)
const darkTheme = {
  primary: "#10B981", // emerald-500
  secondary: "#059669", // emerald-600
  accent: "#34D399", // emerald-400
  text: "#FFFFFF",
  dark: "#111827", // gray-900
  darkSecondary: "#1F2937", // gray-800
  darkTertiary: "#374151", // gray-700
  light: "#4B5563", // gray-600
  lightAccent: "#6B7280", // gray-500
  overlay: "rgba(0, 0, 0, 0.7)",
  primaryHover: "#059669", // emerald-600
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById } = useItems();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Load item data
    try {
      const itemData = getItemById(id);
      if (itemData) {
        setItem(itemData);
      } else {
        setError('Item not found');
      }
    } catch (err) {
      console.error('Error loading item:', err);
      setError('Error loading item details');
    } finally {
      setLoading(false);
    }
  }, [id, getItemById]);

  const handleAddToCart = () => {
    if (item) {
      addToCart(item);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <FrontNavbar fixedTheme={darkTheme} />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-900">
        <FrontNavbar fixedTheme={darkTheme} />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error || 'Item not found'}</p>
            <Link
              to="/listings"
              className="inline-block bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-600 transition duration-300"
            >
              Back to Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <FrontNavbar fixedTheme={darkTheme} />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center text-sm">
              <Link to="/" className="text-gray-400 hover:text-emerald-400">Home</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link to="/listings" className="text-gray-400 hover:text-emerald-400">Listings</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-emerald-400">{item.name}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Images */}
            <div className="lg:w-1/2 p-4 sm:p-6">
              <div className="mb-4 bg-gray-700 rounded-lg overflow-hidden">
                {item.photos && item.photos.length > 0 ? (
                  <img
                    src={item.photos[selectedImage]}
                    alt={item.name}
                    className="w-full h-64 sm:h-96 object-contain"
                  />
                ) : (
                  <div className="w-full h-64 sm:h-96 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail gallery */}
              {item.photos && item.photos.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {item.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-emerald-500 scale-105'
                          : 'border-gray-600 hover:border-emerald-400'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${item.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:w-1/2 p-4 sm:p-6">
              <div className="mb-3">
                <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{item.name}</h1>
              
              <div className="flex items-center mb-4">
                <p className="text-xl sm:text-2xl font-bold text-emerald-400 mr-2">₹{item.price}</p>
                <span className="text-gray-400">{item.duration}</span>
              </div>

              {item.advancedPayment > 0 && (
                <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-300">
                    <span className="font-semibold">Deposit Required:</span> ₹{item.advancedPayment}
                  </p>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300">{item.description || "No description provided."}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="flex-1">Delivery Method: {item.deliveryMethod}</span>
                  </li>
                  {item.location && (
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="flex-1">Location: {item.location}</span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">Listed: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <Link
                  to="/cart"
                  className="flex-1 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 py-3 px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center"
                >
                  Rent Now
                </Link>
              </div>

              {added && (
                <div className="mt-4 p-3 bg-emerald-500/20 text-emerald-400 rounded-lg text-center">
                  Item added to cart!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 