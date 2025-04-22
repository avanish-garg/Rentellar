import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rentalService } from '../services/rentalService';
import { Rental, UpdateRentalDto } from '../types/rental';

interface RentalState {
    rental: Rental | null;
    loading: boolean;
    error: string | null;
}

export const useRental = (rentalId: string) => {
    const { authToken, isAuthenticated, publicKey } = useWallet();
    const [state, setState] = useState<RentalState>({
        rental: null,
        loading: false,
        error: null,
    });

    const fetchRental = async () => {
        if (!isAuthenticated || !authToken) {
            setState(prev => ({ ...prev, error: 'Authentication required' }));
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.getRental(rentalId, authToken);
            setState(prev => ({ ...prev, rental: response.rental }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Failed to fetch rental',
            }));
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const updateRental = async (updates: UpdateRentalDto) => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.updateRental(rentalId, updates, authToken);
            setState(prev => ({ ...prev, rental: response.rental }));
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const startRental = async () => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.startRental(rentalId, authToken);
            setState(prev => ({ ...prev, rental: response.rental }));
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to start rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const completeRental = async () => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.completeRental(rentalId, authToken);
            setState(prev => ({ ...prev, rental: response.rental }));
            return response.rental;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to complete rental';
            setState(prev => ({ ...prev, error }));
            throw new Error(error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const cancelRental = async () => {
        if (!isAuthenticated || !authToken) {
            throw new Error('Authentication required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await rentalService.cancelRental(rentalId, authToken);
            setState(prev => ({ ...prev, rental: response.rental }));
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
            fetchRental();
        }
    }, [isAuthenticated, authToken]);

    return {
        ...state,
        refetch: fetchRental,
        updateRental,
        startRental,
        completeRental,
        cancelRental,
        isOwner: state.rental ? state.rental.owner.publicKey === publicKey : false,
        isRenter: state.rental ? state.rental.renter?.publicKey === publicKey : false,
    };
}; 