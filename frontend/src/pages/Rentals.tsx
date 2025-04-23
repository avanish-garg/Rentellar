import React from 'react';
import { useRentalContext } from '../context/RentalContext';
import { Link } from 'react-router-dom';

const Rentals: React.FC = () => {
  const { rentals, loading, error } = useRentalContext();

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Rentals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <div key={rental.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={rental.imageUrl}
              alt={rental.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{rental.title}</h2>
            <p className="text-gray-600 mb-4">{rental.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                {rental.pricePerDay} XLM/day
              </span>
              <Link
                to={`/rentals/${rental.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rentals; 