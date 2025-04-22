import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const RentalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    quantity: 1
  });

  useEffect(() => {
    fetchRentalDetails();
  }, [id]);

  const fetchRentalDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/rentals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rental details');
      }
      const data = await response.json();
      setRental(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user.address) {
      alert('Please connect your wallet to add items to cart');
      return;
    }

    // Validate dates
    if (!bookingData.startDate || !bookingData.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);

    if (startDate >= endDate) {
      alert('End date must be after start date');
      return;
    }

    if (startDate < new Date()) {
      alert('Start date cannot be in the past');
      return;
    }

    // Calculate number of days
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (days < 1) {
      alert('Rental period must be at least 1 day');
      return;
    }

    // Calculate total amount
    const totalAmount = rental.rentAmount * days * bookingData.quantity;

    addToCart({
      id: rental._id,
      name: rental.name,
      description: rental.description,
      rentAmount: rental.rentAmount,
      deposit: rental.deposit,
      image: rental.image,
      quantity: bookingData.quantity,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      days,
      totalAmount
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading rental details</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold">Rental not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <img
            src={rental.image}
            alt={rental.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="grid grid-cols-4 gap-2">
            {rental.gallery?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${rental.name} ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{rental.name}</h1>
          <p className="text-gray-600">{rental.description}</p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-emerald-600">
                ${rental.rentAmount}/day
              </span>
              <span className="text-gray-500">
                {rental.availableQuantity > 0 ? 'Available' : 'Not Available'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={handleBookingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={handleBookingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={bookingData.quantity}
                  onChange={handleBookingChange}
                  min="1"
                  max={rental.availableQuantity}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Additional Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Category:</span> {rental.category}</p>
              <p><span className="font-medium">Condition:</span> {rental.condition}</p>
              <p><span className="font-medium">Location:</span> {rental.location}</p>
              <p><span className="font-medium">Security Deposit:</span> ${rental.deposit}</p>
              <p><span className="font-medium">Available Quantity:</span> {rental.availableQuantity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetail; 