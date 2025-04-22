import api from '../config/api';

export const rentalService = {
  getAllRentals: async () => {
    const response = await api.get('/rentals');
    return response.data;
  },

  getRentalById: async (id) => {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  },

  createRental: async (rentalData) => {
    const response = await api.post('/rentals', rentalData);
    return response.data;
  },

  updateRental: async (id, rentalData) => {
    const response = await api.put(`/rentals/${id}`, rentalData);
    return response.data;
  },

  deleteRental: async (id) => {
    const response = await api.delete(`/rentals/${id}`);
    return response.data;
  },

  // Cart operations
  addToCart: async (rentalId) => {
    try {
      const response = await api.post('/cart/add', { rentalId });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.msg || 'Item already in cart');
      }
      throw error;
    }
  },

  removeFromCart: async (rentalId) => {
    try {
      const response = await api.delete(`/cart/remove/${rentalId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Item not found in cart');
      }
      throw error;
    }
  },

  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { items: [] };
      }
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Cart not found');
      }
      throw error;
    }
  },

  // Payment operations
  initiatePayment: async (paymentData) => {
    const response = await api.post('/payments/initiate', paymentData);
    return response.data;
  },

  verifyPayment: async (paymentId) => {
    const response = await api.post('/payments/verify', { paymentId });
    return response.data;
  },

  // KYC operations
  submitKYC: async (kycData) => {
    const response = await api.post('/kyc/submit', kycData);
    return response.data;
  },

  getKYCStatus: async () => {
    const response = await api.get('/kyc/status');
    return response.data;
  }
}; 