import {
    Rental,
    RentalResponse,
    SingleRentalResponse,
    CreateRentalDto,
    UpdateRentalDto
} from '../types/rental';

class RentalService {
    private baseUrl = '/api/rentals';

    private async fetchWithAuth(
        endpoint: string,
        authToken: string,
        options: RequestInit = {}
    ): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required');
            }
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch rentals');
        }

        return response.json();
    }

    async getRentals(authToken: string): Promise<RentalResponse> {
        return this.fetchWithAuth('', authToken);
    }

    async getRental(id: string, authToken: string): Promise<SingleRentalResponse> {
        return this.fetchWithAuth(`/${id}`, authToken);
    }

    async createRental(rental: CreateRentalDto, authToken: string): Promise<SingleRentalResponse> {
        return this.fetchWithAuth('', authToken, {
            method: 'POST',
            body: JSON.stringify(rental),
        });
    }

    async updateRental(
        id: string,
        updates: UpdateRentalDto,
        authToken: string
    ): Promise<SingleRentalResponse> {
        return this.fetchWithAuth(`/${id}`, authToken, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteRental(id: string, authToken: string): Promise<void> {
        await this.fetchWithAuth(`/${id}`, authToken, {
            method: 'DELETE',
        });
    }

    async startRental(id: string, authToken: string): Promise<SingleRentalResponse> {
        return this.fetchWithAuth(`/${id}/start`, authToken, {
            method: 'POST',
        });
    }

    async completeRental(id: string, authToken: string): Promise<SingleRentalResponse> {
        return this.fetchWithAuth(`/${id}/complete`, authToken, {
            method: 'POST',
        });
    }

    async cancelRental(id: string, authToken: string): Promise<SingleRentalResponse> {
        return this.fetchWithAuth(`/${id}/cancel`, authToken, {
            method: 'POST',
        });
    }

    async getMyRentals(authToken: string): Promise<RentalResponse> {
        return this.fetchWithAuth('/my-rentals', authToken);
    }

    async getMyListings(authToken: string): Promise<RentalResponse> {
        return this.fetchWithAuth('/my-listings', authToken);
    }
}

export const rentalService = new RentalService(); 