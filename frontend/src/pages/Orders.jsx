import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontNavbar from "../components/FrontNavbar";
import { useUser } from '../context/UserContext';
import { useItems } from '../context/ItemContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

function Orders() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, updateItem } = useItems();
  const { purchaseHistory, cancelOrder } = useCart();
  const { language } = useLanguage();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = translations[language].cart;

  useEffect(() => {
    // Add a small delay to ensure data is loaded
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter active orders
  const activeOrders = purchaseHistory?.filter(order =>
    order?.status === 'active'
  ) || [];

  // Filter completed/cancelled orders
  const pastOrders = purchaseHistory?.filter(order =>
    order?.status !== 'active'
  ) || [];

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowCancelPopup(true);
  };

  const confirmCancelOrder = () => {
    if (selectedOrder) {
      cancelOrder(selectedOrder.id);
      // Update items status in items context
      selectedOrder.items?.forEach(item => {
        if (item) {
          updateItem(item.id, {
            ...item,
            status: 'available',
            rentedBy: null,
            rentalEndDate: null
          });
        }
      });

      setShowCancelPopup(false);
      setSelectedOrder(null);
    }
  };

  // Format price to INR
  const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <FrontNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <FrontNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Orders</h1>

          {/* Active Orders Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Active Orders</h2>
            {activeOrders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No active orders.</p>
            ) : (
              <div className="space-y-6">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Order #{order.id?.split('-')[1] || 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ordered on {order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>

                      <div className="space-y-4">
                        {order.items?.map((item) => item && (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <img
                              src={item.photos?.[0] || '/placeholder-image.jpg'}
                              alt={item.name || 'Product'}
                              className="w-20 h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">{item.name || 'Unknown Product'}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Rental Period: {new Date(order.purchaseDate).toLocaleDateString()} - {item.rentalEndDate ? new Date(item.rentalEndDate).toLocaleDateString() : 'N/A'}
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.price * (item.quantity || 1))}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantity || 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Orders Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Order History</h2>
            {pastOrders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No order history.</p>
            ) : (
              <div className="space-y-6">
                {pastOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Order #{order.id?.split('-')[1] || 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.status === 'cancelled'
                              ? `Cancelled on ${order.cancellationDate ? new Date(order.cancellationDate).toLocaleDateString() : 'Unknown date'}`
                              : `Completed on ${order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : 'Unknown date'}`
                            }
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {(order.status?.charAt(0).toUpperCase() + order.status?.slice(1)) || 'Unknown'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {order.items?.map((item) => item && (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <img
                              src={item.photos?.[0] || '/placeholder-image.jpg'}
                              alt={item.name || 'Product'}
                              className="w-20 h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">{item.name || 'Unknown Product'}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Rental Period: {new Date(order.purchaseDate).toLocaleDateString()} - {
                                  order.status === 'cancelled'
                                    ? (order.cancellationDate ? new Date(order.cancellationDate).toLocaleDateString() : 'N/A')
                                    : (item.rentalEndDate ? new Date(item.rentalEndDate).toLocaleDateString() : 'N/A')
                                }
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.price * (item.quantity || 1))}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantity || 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cancel Order</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel this order? Your refund will be processed within 7 working days.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => setShowCancelPopup(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders; 