import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import { rentalService } from '../services/rentalService';
import { Rental, CreateRentalDto, UpdateRentalDto, RentalStatus } from '../types/rental';

interface RentalState {
    rentals: Rental[];
    myRentals: Rental[];
    myListings: Rental[];
    loading: boolean;
    error: string | null;
}

export const useRentals = () => {
    const { authToken, isAuthenticated, publicKey } = useWallet();
    const [state, setState] = useState<RentalState>({
        rentals: [],
        myRentals: [],
        myListings: [],
        loading: false,
        error: null,
    });

    const fetchRentals = useCallback(async () => {
        if (!isAuthenticated || !authToken) {
            setState(prev => ({ ...prev, error: 'Authentication required' }));
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const [rentalsRes, myRentalsRes, myListingsRes] = await Promise.all([
                rentalService.getRentals(authToken),
                rentalService.getMyRentals(authToken),
                rentalService.getMyListings(authToken),
            ]);

            setState(prev => ({
                ...prev,
                rentals: rentalsRes.rentals,
                myRentals: myRentalsRes.rentals,
                myListings: myListingsRes.rentals,
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Failed to fetch rentals',
            }));
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [isAuthenticated, authToken]);

    const createRental = async (rental: CreateRentalDto) => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.createRental(rental, authToken);
            setState(prev => ({
                ...prev,
                myListings: [...prev.myListings, response.rental],
                rentals: [...prev.rentals, response.rental],
            }));
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const updateRental = async (id: string, updates: UpdateRentalDto) => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.updateRental(id, updates, authToken);
            
            const updateRentalInList = (rentals: Rental[], updatedRental: Rental) =>
                rentals.map(r => r.id === updatedRental.id ? updatedRental : r);

            setState(prev => ({
                ...prev,
                rentals: updateRentalInList(prev.rentals, response.rental),
                myListings: updateRentalInList(prev.myListings, response.rental),
                myRentals: updateRentalInList(prev.myRentals, response.rental),
            }));
            
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const startRental = async (id: string) => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.startRental(id, authToken);
            
            const updateRentalInList = (rentals: Rental[], updatedRental: Rental) =>
                rentals.map(r => r.id === updatedRental.id ? updatedRental : r);

            setState(prev => ({
                ...prev,
                rentals: updateRentalInList(prev.rentals, response.rental),
                myRentals: [...prev.myRentals, response.rental],
            }));
            
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to start rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const completeRental = async (id: string) => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.completeRental(id, authToken);
            
            const updateRentalInList = (rentals: Rental[], updatedRental: Rental) =>
                rentals.map(r => r.id === updatedRental.id ? updatedRental : r);

            setState(prev => ({
                ...prev,
                rentals: updateRentalInList(prev.rentals, response.rental),
                myRentals: updateRentalInList(prev.myRentals, response.rental),
                myListings: updateRentalInList(prev.myListings, response.rental),
            }));
            
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to complete rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const cancelRental = async (id: string) => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.cancelRental(id, authToken);
            
            const updateRentalInList = (rentals: Rental[], updatedRental: Rental) =>
                rentals.map(r => r.id === updatedRental.id ? updatedRental : r);

            setState(prev => ({
                ...prev,
                rentals: updateRentalInList(prev.rentals, response.rental),
                myRentals: updateRentalInList(prev.myRentals, response.rental),
                myListings: updateRentalInList(prev.myListings, response.rental),
            }));
            
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to cancel rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        if (isAuthenticated && authToken) {
            fetchRentals();
        }
    }, [isAuthenticated, authToken, fetchRentals]);

    return {
        ...state,
        refetch: fetchRentals,
        createRental,
        updateRental,
        startRental,
        completeRental,
        cancelRental,
        isOwner: (rental: Rental) => rental.owner.publicKey === publicKey,
        isRenter: (rental: Rental) => rental.renter?.publicKey === publicKey,
    };
}; 