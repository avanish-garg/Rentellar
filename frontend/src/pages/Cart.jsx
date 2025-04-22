import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import FrontNavbar from "../components/FrontNavbar";
import { useNavigate } from 'react-router-dom';

// Fallback images by category
const categoryImages = {
  "Clothing": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2305&q=80",
  "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Musical instruments": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Sporting goods": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Tools & equipment": "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "Other": "https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { language } = useLanguage();
  const t = translations[language].cart;
  const navigate = useNavigate();

  // Get image source with fallback
  const getImageSrc = (item) => {
    if (item.photos && item.photos.length > 0 && item.photos[0]) {
      return item.photos[0];
    }
    return categoryImages[item.category] || categoryImages["Other"];
  };

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <FrontNavbar />
        <div className="pt-16 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">{t.emptyCart}</h1>
            <p className="text-gray-400">{t.emptyCartMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <FrontNavbar />
      <div className="pt-16 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">{t.shoppingCart}</h1>
          
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.rental._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-6">
                  <img 
                    src={getImageSrc(item.rental)} 
                    alt={item.rental.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = categoryImages["Other"];
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.rental.name}</h3>
                    <p className="text-gray-400 mb-4">{item.rental.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.rental._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.rental._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">
                          {formatPrice((item.rental.price || item.rental.rentAmount || 0) * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.rental._id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl">{t.total}</span>
              <span className="text-2xl font-bold">{formatPrice(getCartTotal())}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5">
              {t.checkout}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 