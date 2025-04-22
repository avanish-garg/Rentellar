import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FrontNavbar from "../components/FrontNavbar";
import { useItems } from "../context/ItemContext";
import { useUser } from "../context/UserContext";
import smartwatch from "../assets/Smartwatch.png";
import gameConsole from "../assets/Game Console.png";
import vrHeadset from "../assets/vr headset.png";
import smartSpeaker from "../assets/smart speaker.png";
import laptop from "../assets/Laptop.png";
import earphones from "../assets/Earphones.png";
import beatsHeadphones from "../assets/Beats Solo Headphones.png";
import diningChair from "../assets/diningchair.jpg";
import sofa from "../assets/sofas.jpg";
import table from "../assets/table.jpg";

// Dark theme colors
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

function AddItem() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addItem } = useItems();
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [customCategory, setCustomCategory] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [advancedPayment, setAdvancedPayment] = useState("");
  const [priceError, setPriceError] = useState("");
  const [advancedPaymentError, setAdvancedPaymentError] = useState("");
  const [duration, setDuration] = useState("Per day");
  const [description, setDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Meet in person");
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeDuration, setActiveDuration] = useState(0);
  const [activeDelivery, setActiveDelivery] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  
  // Reference to the hidden file input
  const fileInputRef = useRef(null);

  const resetForm = () => {
    // Reset form
    setItemName("");
    setCategory("Clothing");
    setCustomCategory("");
    setRentalPrice("");
    setAdvancedPayment("");
    setDescription("");
    setDeliveryMethod("Meet in person");
    setPhotos([]);
    setActiveCategory(0);
    setActiveDuration(0);
    setActiveDelivery(0);
    setError("");
    setSuccess(false);
    setShowOptionsModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user.isLoggedIn) {
      setError("Please log in to add an item");
      return;
    }
    
    // Validate price
    if (!rentalPrice || parseInt(rentalPrice) < 10) {
      setPriceError("Rental price must be at least ₹10");
      return;
    }
    
    // Check if at least one photo is uploaded
    if (photos.length === 0) {
      setError("Please upload at least one photo of your item");
      return;
    }
    
    // Check if name is provided
    if (!itemName.trim()) {
      setError("Please provide a name for your item");
      return;
    }
    
    // Clear any previous errors
    setError("");
    
    // Prepare item data
    const itemData = {
      name: itemName,
      category: category === "Other" ? customCategory : category,
      price: parseInt(rentalPrice),
      advancedPayment: advancedPayment ? parseInt(advancedPayment) : 0,
      duration,
      description,
      deliveryMethod,
      photos: photos.map(photo => photo.preview), // Store photo data URLs
      status: "available",
      location: "Your Location", // Could be added from user profile or GPS
      featured: false,
      rating: 0,
      reviews: [],
      userId: user.id || "anonymous", // Make sure to include userId for filtering
      createdAt: new Date().toISOString()
    };
    
    // Add the item to context
    try {
      const addedItem = addItem(itemData);
      console.log("Item added successfully:", addedItem);
      
      // Show success message and options modal
      setSuccess(true);
      setShowOptionsModal(true);
      
    } catch (error) {
      console.error("Error adding item:", error);
      setError("An error occurred while adding your item. Please try again.");
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleAddMoreItems = () => {
    resetForm();
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    // Allow only positive numbers
    if (value === "" || parseInt(value) >= 0) {
      setRentalPrice(value);
      
      // Show error if less than 10, otherwise clear error
      if (value !== "" && parseInt(value) < 10) {
        setPriceError("Rental price must be at least ₹10");
      } else {
        setPriceError("");
      }
    }
  };

  const handleAdvancedPaymentChange = (e) => {
    const value = e.target.value;
    
    // Allow only positive numbers
    if (value === "" || parseInt(value) >= 0) {
      setAdvancedPayment(value);
      
      if (value !== "" && parseInt(value) < 0) {
        setAdvancedPaymentError("Advanced payment cannot be negative");
      } else if (rentalPrice && parseInt(value) > parseInt(rentalPrice) * 3) {
        setAdvancedPaymentError("Advanced payment should not exceed 3 times the rental price");
      } else {
        setAdvancedPaymentError("");
      }
    }
  };

  // Categories
  const categories = [
    "Clothing", 
    "Electronics", 
    "Musical instruments", 
    "Sporting goods", 
    "Tools & equipment",
    "Other"
  ];

  // Duration options
  const durations = [
    "Per day",
    "Per week",
    "Per month",
    "Per year"
  ];

  // Delivery options
  const deliveryOptions = [
    "Meet in person",
    "Delivery only",
    "Shipping only"
  ];

  // Sample images for the demo
  const sampleImages = [
    smartwatch,
    gameConsole,
    vrHeadset,
    smartSpeaker,
    laptop,
    earphones,
    beatsHeadphones,
    diningChair,
    sofa,
    table
  ];

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 0) {
      const newPhotos = selectedFiles.map(file => {
        // Create a data URL instead of an object URL for better persistence
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              file,
              preview: event.target.result // This creates a base64 data URL instead of a blob URL
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      // Wait for all file conversions to complete
      Promise.all(newPhotos).then(photoObjects => {
        setPhotos(prevPhotos => [...prevPhotos, ...photoObjects]);
      });
    }
    
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Remove a photo
  const removePhoto = (index) => {
    setPhotos(prevPhotos => {
      const updatedPhotos = [...prevPhotos];
      // No need to revoke for data URLs - just remove the photo
      updatedPhotos.splice(index, 1);
      return updatedPhotos;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <FrontNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Item</h1>
          
          {/* Wallet Address Display */}
          {user.isLoggedIn && user.walletAddress && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Wallet Address</h2>
              <p className="text-gray-600 dark:text-gray-300 font-mono break-all">{user.walletAddress}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item name */}
            <div>
              <label htmlFor="itemName" className="block mb-2 text-lg font-medium text-white">
                Item name
              </label>
              <input
                type="text"
                id="itemName"
                placeholder="Name the item"
                className="w-full p-4 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 border border-gray-600"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            
            {/* Category */}
            <div>
              <label className="block mb-3 text-lg font-medium text-white">
                Select a category
              </label>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {categories.map((cat, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-emerald-400/20 hover:shadow-lg ${
                      activeCategory === index 
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      setActiveCategory(index);
                      setCategory(cat);
                    }}
                  >
                    <p className="text-center font-medium">{cat}</p>
                  </div>
                ))}
              </div>
              
              {/* Custom category input */}
              {category === "Other" && (
                <div className="mt-4">
                  <label htmlFor="customCategory" className="block mb-2 text-md font-medium text-emerald-400">
                    Enter custom category
                  </label>
                  <input
                    type="text"
                    id="customCategory"
                    placeholder="Enter your category"
                    className="w-full p-4 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 border border-gray-600"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            {/* Rental price */}
            <div>
              <label htmlFor="rentalPrice" className="block mb-2 text-lg font-medium text-white">
                Rental price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 text-xl">
                  ₹
                </span>
                <input
                  type="number"
                  id="rentalPrice"
                  placeholder="0"
                  min="10"
                  className={`w-full p-4 pl-10 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 border ${
                    priceError ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-emerald-400'
                  }`}
                  value={rentalPrice}
                  onChange={handlePriceChange}
                />
              </div>
              {priceError && (
                <p className="mt-2 text-red-400 text-sm">{priceError}</p>
              )}
              <p className="mt-2 text-emerald-400 text-sm">Minimum price: ₹10</p>
            </div>
            
            {/* Advanced Payment */}
            <div>
              <label htmlFor="advancedPayment" className="block mb-2 text-lg font-medium text-white">
                Advanced Payment
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 text-xl">
                  ₹
                </span>
                <input
                  type="number"
                  id="advancedPayment"
                  placeholder="0"
                  min="0"
                  className={`w-full p-4 pl-10 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 border ${
                    advancedPaymentError ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-emerald-400'
                  }`}
                  value={advancedPayment}
                  onChange={handleAdvancedPaymentChange}
                />
              </div>
              {advancedPaymentError && (
                <p className="mt-2 text-red-400 text-sm">{advancedPaymentError}</p>
              )}
              <p className="mt-2 text-emerald-400 text-sm">Security deposit or advance payment required from renter</p>
            </div>
            
            {/* Duration */}
            <div>
              <label className="block mb-3 text-lg font-medium text-white">
                Duration
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {durations.map((opt, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-emerald-400/20 hover:shadow-lg ${
                      activeDuration === index 
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      setActiveDuration(index);
                      setDuration(opt);
                    }}
                  >
                    <p className="text-center font-medium">{opt}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-2 text-lg font-medium text-white">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Tell renters about your item"
                className="w-full p-4 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 border border-gray-600 h-36 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            {/* Upload photos */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Upload photos</h3>
              <p className="text-emerald-400 mb-4">
                Show off your item with high-quality photos. You can add up to 10 photos.
              </p>
              
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/*" 
                multiple 
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* User uploaded photos */}
                {photos.map((photo, index) => (
                  <div key={`user-photo-${index}`} className="group relative">
                    <div 
                      className="aspect-square rounded-xl overflow-hidden border-2 border-gray-600 hover:border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-400/20"
                      onClick={triggerFileInput}
                    >
                      <img
                        src={photo.preview}
                        alt={`User upload ${index + 1}`}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <button 
                      type="button" 
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => removePhoto(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {/* Sample images if no photos uploaded */}
                {photos.length === 0 && sampleImages.map((image, index) => (
                  <div key={`sample-${index}`} className="group relative">
                    <div 
                      className="aspect-square rounded-xl overflow-hidden border-2 border-gray-600 hover:border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-400/20"
                      onClick={triggerFileInput}
                    >
                      <img
                        src={image}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-white text-center px-2">Click to upload your photos</p>
                    </div>
                  </div>
                ))}
                
                {/* Add more photos button - only if less than 10 photos */}
                {photos.length > 0 && photos.length < 10 && (
                  <div 
                    className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-600 hover:border-emerald-400 transition-all duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-700"
                    onClick={triggerFileInput}
                  >
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-gray-500 mt-2">Add photo</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add more photos button below grid if no photos are uploaded yet */}
              {photos.length === 0 && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full py-4 border-2 border-dashed border-gray-600 hover:border-emerald-400 text-gray-500 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center group"
                    onClick={triggerFileInput}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add your photos
                  </button>
                </div>
              )}
            </div>
            
            {/* Delivery options */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Delivery options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryOptions.map((opt, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-emerald-400/20 hover:shadow-lg ${
                      activeDelivery === index 
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      setActiveDelivery(index);
                      setDeliveryMethod(opt);
                    }}
                  >
                    <p className="text-center font-medium">{opt}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pt-6">
              <button
                type="submit"
                className="md:flex-1 px-8 py-4 rounded-xl text-white font-medium text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${darkTheme.primary}, ${darkTheme.secondary})`,
                  boxShadow: `0 10px 20px -10px ${darkTheme.primary}`,
                }}
              >
                Submit listing
              </button>
              <Link
                to="/"
                className="md:flex-1 px-8 py-4 rounded-xl font-medium text-lg border-2 text-emerald-400 border-emerald-400 bg-transparent hover:bg-emerald-900 hover:text-emerald-200 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4 animate-fadeIn border border-gray-700">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Item Added Successfully!</h3>
              <p className="text-gray-400">Your item has been added to our listings. What would you like to do next?</p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleReturnHome}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Return to Home Page
              </button>
              <button 
                onClick={handleAddMoreItems}
                className="py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Add More Items
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success notification - This is now hidden in favor of the modal */}
      {success && !showOptionsModal && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Your item was successfully added!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddItem; 