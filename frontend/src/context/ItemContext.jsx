import React, { createContext, useState, useContext, useEffect } from 'react';
import { rentalService } from '../services/rentalService';

// Create context
const ItemContext = createContext();

// Provider component
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items from backend on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await rentalService.getAllRentals();
        setItems(response.rentals || []);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Get all items
  const getAllItems = () => {
    return items;
  };

  // Get item by id
  const getItemById = async (id) => {
    try {
      const response = await rentalService.getRentalById(id);
      return response;
    } catch (error) {
      console.error("Error fetching item:", error);
      throw error;
    }
  };

  // Get items by category
  const getItemsByCategory = (category) => {
    // Case-insensitive comparison to improve matching
    return items.filter(item => 
      item.category && item.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Get items by user
  const getItemsByUser = (userId) => {
    return items.filter(item => item.userId === userId);
  };

  return (
    <ItemContext.Provider value={{ 
      items, 
      loading,
      error,
      getAllItems, 
      getItemById, 
      getItemsByCategory,
      getItemsByUser
    }}>
      {children}
    </ItemContext.Provider>
  );
};

// Custom hook for using the context
export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
}; 