import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FrontNavbar from "../components/FrontNavbar";
import { useItems } from '../context/ItemContext';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
// Import images from assets - using placeholder images from the existing assets folder
import earphones from '../assets/Earphones.png';
import smartwatch from '../assets/Smartwatch.png';
import laptop from '../assets/Laptop.png';
import gamingConsole from '../assets/Game Console.png';
import vrHeadset from '../assets/vr headset.png';
import smartSpeaker from '../assets/smart speaker.png';

// Dark theme colors (same as AddItem page)
const darkTheme = {
  primary: "#10B981", // emerald-500 - keeping the primary accent color
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

// Default categories with images
const categoryImages = {
  "Clothing": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2305&q=80",
  "Electronics": smartwatch,
  "Musical instruments": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Sporting goods": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Tools & equipment": "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Other": "https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
};

const Categories = () => {
  const { items, getItemsByCategory } = useItems();
  const { user } = useUser();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayedItems, setDisplayedItems] = useState([]);
  const [categories, setCategories] = useState([
    "All",
    "Clothing", 
    "Electronics", 
    "Musical instruments", 
    "Sporting goods", 
    "Tools & equipment",
    "Other"
  ]);
  const t = translations[language].cart;
  const [addedToCart, setAddedToCart] = useState(null);

  // Read category from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      // Check if the category exists in our list
      if (categories.includes(categoryParam)) {
        setSelectedCategory(categoryParam);
      } else {
        // For custom categories, add it to our list first
        setCategories(prevCategories => {
          if (!prevCategories.includes(categoryParam)) {
            return [...prevCategories, categoryParam];
          }
          return prevCategories;
        });
        // Then select it
        setSelectedCategory(categoryParam);
      }
    }
  }, [location.search, categories]);

  // Set displayed items whenever selectedCategory changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setDisplayedItems(items);
    } else {
      setDisplayedItems(getItemsByCategory(selectedCategory));
    }
  }, [selectedCategory, items, getItemsByCategory]);

  // Animation effect on component mount and update list of categories from items
  useEffect(() => {
    // Fade in elements with animate-fade-in class
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0', 'translate-y-4');
      }, 100 * index);
    });

    // Get unique categories from items
    const itemCategories = [...new Set(items.map(item => item.category))];
    if (itemCategories.length > 0) {
      // Combine default categories with any custom ones from items
      const allCategories = ["All", "Clothing", "Electronics", "Musical instruments", "Sporting goods", "Tools & equipment", "Other"];
      
      // Add any custom categories not in our default list
      itemCategories.forEach(cat => {
        if (!allCategories.includes(cat) && cat !== "All") {
          allCategories.push(cat);
        }
      });
      
      setCategories(allCategories);
    }
  }, [items]);

  // Handle add item click - redirect to add item page if logged in
  const handleAddItemClick = () => {
    if (user.isLoggedIn) {
      navigate('/add-item');
    } else {
      navigate('/login');
    }
  };

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedToCart(item._id);
    
    // Clear notification after 2 seconds
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <FrontNavbar fixedTheme={darkTheme} />
      
      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in opacity-0 translate-y-4 transition-all duration-700">
            <h1 className="text-4xl font-bold mb-4 text-emerald-400">Browse Categories</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Find the perfect items to rent for your needs. Browse through various categories
              or add your own items for others to rent.
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-gray-800 py-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap overflow-x-auto hide-scrollbar space-x-4 py-2">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {displayedItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">No items found in this category</h2>
            <p className="text-gray-400 mb-6">Be the first to add an item in this category!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedItems.map((item, index) => (
              <div 
                key={item.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300  translate-y-4 transform hover:-translate-y-1 border border-gray-700"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Image Container - Larger, more prominent */}
                <div className="relative h-60 overflow-hidden bg-gray-700">
                  {item.photos && item.photos.length > 0 ? (
                    <img 
                      src={item.photos[0]} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        // If image fails to load, replace with category image or placeholder
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = categoryImages[item.category] || categoryImages["Other"];
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src={categoryImages[item.category] || categoryImages["Other"]} 
                        alt={item.category}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-emerald-500 text-white px-3 py-1 text-sm font-semibold">
                    {item.category}
                  </div>
                  
                  {/* Price tag in top right */}
                  <div className="absolute top-3 right-3 bg-gray-900/90 text-emerald-400 px-3 py-2 rounded-lg shadow-md font-bold">
                    ₹{item.price}
                    <span className="block text-xs text-gray-400 font-normal">{item.duration}</span>
                    {item.advancedPayment > 0 && (
                      <span className="block text-xs text-yellow-400 font-normal">+ ₹{item.advancedPayment} advance</span>
                    )}
                  </div>
                </div>
                
                {/* Details Container */}
                <div className="p-5">
                  {/* Item Name */}
                  <h3 className="text-lg font-bold mb-2 text-white">{item.name}</h3>
                  
                  {/* Description with ellipsis for overflow */}
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description || "No description provided"}</p>
                  
                  {/* Info Row */}
                  <div className="flex items-center text-xs text-gray-400 mb-4 space-x-4">
                    {item.deliveryMethod && (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {item.deliveryMethod}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2">
                    <Link 
                      to={`/item/${item.id}`} 
                      className="flex-1 block text-center bg-gray-700 hover:bg-gray-600 text-emerald-400 font-medium rounded-lg py-2 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg py-2 transition-colors duration-300"
                    >
                      {t.addToCart}
                    </button>
                  </div>
                  
                  {/* Added to cart notification */}
                  {addedToCart === item.id && (
                    <div className="mt-2 py-1 px-2 bg-emerald-500/20 text-emerald-400 text-sm text-center rounded">
                      {t.itemAdded}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-gray-800 py-12 mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-emerald-400">Ready to Rent Out Your Items?</h2>
              <p className="text-gray-300">Turn your idle items into income and help others access what they need.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 