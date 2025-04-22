import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import FrontNavbar from "../components/FrontNavbar";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, processCheckout, loading, error } = useCart();
  const { language } = useLanguage();
  const t = translations[language].cart;
  const navigate = useNavigate();
  
  // State management
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  
  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Format price to APT tokens (mock conversion: 1 INR = 0.05 APT for demo)
  const formatAPT = (price) => {
    const aptValue = price * 0.05;
    return aptValue.toFixed(2);
  };
  
  // Handle wallet connection
  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if Petra wallet is available
      if (!window.petra) {
        throw new Error('Petra wallet not found. Please install Petra wallet extension.');
      }

      // Request connection using the new wallet standard
      const response = await window.petra.connect();
      
      // Get the connected account address
      const account = await window.petra.account();
      
      // Set the wallet address and connection state
      setWalletAddress(account.address);
      setIsConnected(true);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle payment processing
  const handlePayment = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    
    try {
      if (!window.petra) {
        throw new Error('Petra wallet not found');
      }

      // Get the current account
      const account = await window.petra.account();
      
      // Verify the connected account matches the one we have
      if (account.address !== walletAddress) {
        throw new Error('Connected wallet address does not match');
      }

      // Calculate total amount in APT tokens
      const totalInINR = getCartTotal();
      const totalInAPT = totalInINR * 0.05; // Convert INR to APT (mock conversion)

      // Prepare transaction payload according to Petra wallet format
      const transaction = {
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          "0x7b52f908faf021082df50916367897968260668f5e2e143f995572179e78f13b", // Your wallet address
          totalInAPT.toString()
        ],
        sender: walletAddress,
        max_gas_amount: "2000",
        gas_unit_price: "100",
        expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString() // 10 minutes from now
      };

      // Sign and submit transaction
      const response = await window.petra.signAndSubmitTransaction(transaction);
      
      // Process the checkout in our backend
      await processCheckout();
      
      setPaymentComplete(true);
      clearCart();
      
      // Redirect to success page after successful payment
      setTimeout(() => {
        navigate('/success');
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Truncate wallet address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-900">
        <FrontNavbar />
        <div className="pt-16 text-white">
          <div className="max-w-lg mx-auto px-4 py-12 text-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/10">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">{t.paymentSuccessful}</h1>
              <div className="text-emerald-400 text-lg font-medium mb-6">
                Transaction ID: {walletAddress.substring(0, 10)}...
              </div>
              <p className="text-gray-300 mb-8">{t.thankYou}</p>
              <p className="text-gray-400 mb-8">{t.redirecting}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-900">
      <FrontNavbar />
      <div className="pt-16 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">{t.checkout}</h1>
          
          {/* Order Summary */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 mb-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">{t.orderSummary}</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-400">
                    {item.quantity} x {formatPrice(item.price || item.rentAmount || 0)}/day
                  </p>
                  <p className="text-gray-400">
                    Security Deposit: {formatPrice(item.deposit || 0)}
                  </p>
                  <p className="text-gray-400">
                    Total: {formatPrice(((item.price || item.rentAmount || 0) + (item.deposit || 0)) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t.totalAmount}:</span>
                <span className="text-xl font-bold text-emerald-400">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 mb-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">{t.walletConnection}</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                placeholder={t.connectWallet}
              />
              <button
                onClick={connectWallet}
                disabled={isConnecting || isConnected}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  isConnecting || isConnected
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isConnecting ? t.connecting : isConnected ? t.connected : t.connectWallet}
              </button>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-end">
            <button
              onClick={handlePayment}
              disabled={isProcessing || !isConnected}
              className={`px-8 py-3 rounded-lg font-semibold ${
                isProcessing || !isConnected
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isProcessing ? t.processing : t.completePayment}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout; 