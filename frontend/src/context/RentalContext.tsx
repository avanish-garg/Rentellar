import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRentals } from '../hooks/useRentals';
import { Rental } from '../types/rental';

interface RentalContextType {
  rentals: Rental[];
  myRentals: Rental[];
  myListings: Rental[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRental: (rental: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRental: (id: string, rental: Partial<Rental>) => Promise<void>;
  startRental: (id: string) => Promise<void>;
  completeRental: (id: string) => Promise<void>;
  cancelRental: (id: string) => Promise<void>;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    rentals,
    myRentals,
    myListings,
    loading,
    error,
    refetch,
    createRental,
    updateRental,
    startRental,
    completeRental,
    cancelRental
  } = useRentals();

  return (
    <RentalContext.Provider
      value={{
        rentals,
        myRentals,
        myListings,
        loading,
        error,
        refetch,
        createRental,
        updateRental,
        startRental,
        completeRental,
        cancelRental
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRentalContext = () => {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error('useRentalContext must be used within a RentalProvider');
  }
  return context;
}; 