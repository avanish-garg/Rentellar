import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RentalList } from '../components/RentalList';
import { useRentals } from '../hooks/useRentals';

// Mock the useRentals hook
vi.mock('../hooks/useRentals', () => ({
  useRentals: vi.fn()
}));

describe('Rental Components', () => {
  it('should render rental list', () => {
    const mockRentals = [
      {
        id: '1',
        title: 'Test Rental',
        description: 'Test Description',
        pricePerDay: 100,
        securityDeposit: 500,
        imageUrl: 'https://example.com/image.jpg',
        owner: 'owner123',
        renter: null,
        status: 'AVAILABLE',
        startDate: null,
        endDate: null,
        escrowAccount: 'escrow123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    (useRentals as any).mockReturnValue({
      rentals: mockRentals,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<RentalList />);
    expect(screen.getByText('Test Rental')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useRentals as any).mockReturnValue({
      rentals: [],
      loading: true,
      error: null,
      refetch: vi.fn()
    });

    render(<RentalList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useRentals as any).mockReturnValue({
      rentals: [],
      loading: false,
      error: 'Failed to load rentals',
      refetch: vi.fn()
    });

    render(<RentalList />);
    expect(screen.getByText('Failed to load rentals')).toBeInTheDocument();
  });
}); 