export enum RentalStatus {
    AVAILABLE = 'AVAILABLE',
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface Rental {
    id: string;
    title: string;
    description: string;
    pricePerDay: string;
    securityDeposit: string;
    imageUrl?: string;
    owner: {
        publicKey: string;
        rating?: number;
    };
    renter?: {
        publicKey: string;
        rating?: number;
    };
    status: RentalStatus;
    startDate?: string;
    endDate?: string;
    escrowAccount?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRentalDto {
    title: string;
    description: string;
    pricePerDay: string;
    securityDeposit: string;
    imageUrl?: string;
}

export interface UpdateRentalDto {
    title?: string;
    description?: string;
    pricePerDay?: string;
    securityDeposit?: string;
    imageUrl?: string;
    status?: RentalStatus;
}

export interface RentalResponse {
    message: string;
    rentals: Rental[];
}

export interface SingleRentalResponse {
    message: string;
    rental: Rental;
} 