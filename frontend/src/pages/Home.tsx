import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Home: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Rentellar</h1>
      <p className="text-xl mb-8">
        A decentralized P2P rental platform powered by Stellar blockchain
      </p>
      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-lg">Connect your wallet to get started</p>
          <Link
            to="/rentals"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            View Rentals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <Link
            to="/rentals/create"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 mr-4"
          >
            Create Rental
          </Link>
          <Link
            to="/rentals"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            View Rentals
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home; 