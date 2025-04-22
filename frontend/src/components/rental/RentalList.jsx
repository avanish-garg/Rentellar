import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rentalService } from '../../services/rentalService';

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const data = await rentalService.getAllRentals();
      setRentals(data.rentals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Rentals</h1>
        {user && (
          <Link
            to="/rentals/add"
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            List Your Item
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <div key={rental._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`http://localhost:5000${rental.image}`}
              alt={rental.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{rental.name}</h2>
              <p className="text-gray-600 mb-4">{rental.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-500 font-semibold">₹{rental.rentAmount}/day</span>
                <Link
                  to={`/rentals/${rental.tokenId}`}
                  className="text-emerald-500 hover:text-emerald-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalList; 