import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navbar: React.FC = () => {
  const { isConnected, publicKey, connectWallet, disconnectWallet } = useWallet();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Rentellar
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/rentals" className="text-gray-600 hover:text-gray-800">
              Rentals
            </Link>
            {isConnected ? (
              <>
                <Link to="/rentals/create" className="text-gray-600 hover:text-gray-800">
                  Create Rental
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                  Profile
                </Link>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
                <span className="text-gray-600">
                  {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                </span>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 