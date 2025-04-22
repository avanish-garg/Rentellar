import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useAuth } from './AuthContext';
import { rentalService } from '../services/rentalService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { isAuthenticated } = useAuth();

  // Load cart from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await rentalService.getCart();
          setCartItems(response.items || []);
        } catch (error) {
          console.error('Error loading cart:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCart();
  }, [isAuthenticated]);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to add items to cart');
    }

    try {
      // Get the rental ID, handling both raw items and items with rental property
      const rentalId = item.rental?._id || item._id;
      if (!rentalId) {
        throw new Error('Invalid item: missing rental ID');
      }

      // Add to backend cart
      const response = await rentalService.addToCart(rentalId);
      
      // Update local cart state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.rental._id === rentalId);
        if (existingItem) {
          return prevItems.map(i =>
            i.rental._id === rentalId ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        // If item has rental property, use it directly, otherwise wrap the item
        const rentalItem = item.rental ? item.rental : item;
        return [...prevItems, { rental: rentalItem, quantity: 1 }];
      });

      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Remove from backend cart
      await rentalService.removeFromCart(itemId);
      
      // Update local cart state
      setCartItems(prevItems => prevItems.filter(item => item.rental._id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.rental._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    try {
      await rentalService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.rental.price || item.rental.rentAmount || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const processCheckout = async () => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to checkout');
    }

    setLoading(true);
    setError(null);

    try {
      // Get wallet address from Petra or user context
      let walletAddress;
      if (window.aptos) {
        const response = await window.aptos.connect();
        walletAddress = response.address;
      } else {
        walletAddress = user.address;
      }

      if (!walletAddress) {
        throw new Error('No wallet address found');
      }

      // Process each item in the cart
      for (const item of cartItems) {
        // Verify the rental exists and is available
        const rental = await rentalService.getRentalById(item.rental._id);
        if (!rental) {
          throw new Error(`Rental ${item.rental._id} not found`);
        }

        if (rental.rental.availableQuantity <= 0) {
          throw new Error(`Rental ${rental.rental.name} is not available`);
        }

        // Calculate total amount (rent + deposit) for this item
        const itemPrice = rental.rental.rentAmount || 0;
        const itemDeposit = rental.rental.deposit || 0;
        const totalAmount = (itemPrice + itemDeposit) * item.quantity;

        // Book the rental
        const response = await fetch('http://localhost:5000/api/rentals/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            rentalId: item.rental._id
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || result.error || 'Failed to process rental');
        }

        console.log('Rental booked:', result);
      }

      // Clear cart after successful checkout
      await clearCart();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      processCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}; 