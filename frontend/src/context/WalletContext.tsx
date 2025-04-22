import React, { createContext, useContext, useState, useEffect } from 'react';
import { Keypair, TransactionBuilder, Operation, Asset, Networks, BASE_FEE } from 'stellar-sdk';
import Server from 'stellar-sdk';

interface WalletContextType {
  publicKey: string | null;
  balance: string;
  isAuthenticated: boolean;
  authToken: string | null;
  createWallet: () => Promise<void>;
  connectWallet: (secretKey: string) => Promise<void>;
  disconnectWallet: () => void;
  sendPayment: (recipient: string, amount: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  balance: '0',
  isAuthenticated: false,
  authToken: null,
  createWallet: async () => {},
  connectWallet: async () => {},
  disconnectWallet: () => {},
  sendPayment: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth token in localStorage
    const token = localStorage.getItem('authToken');
    const storedPublicKey = localStorage.getItem('publicKey');
    
    if (token && storedPublicKey) {
      setAuthToken(token);
      setPublicKey(storedPublicKey);
      setIsAuthenticated(true);
      updateBalance(storedPublicKey);
    }
  }, []);

  const updateBalance = async (accountPublicKey: string) => {
    try {
      const server = new Server('https://horizon-testnet.stellar.org');
      const account = await server.loadAccount(accountPublicKey);
      const xlmBalance = account.balances.find(b => b.asset_type === 'native');
      setBalance(xlmBalance?.balance || '0');
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const registerWallet = async (publicKey: string): Promise<string> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey }),
    });

    if (!response.ok) {
      throw new Error('Failed to register wallet');
    }

    const data = await response.json();
    return data.token;
  };

  const loginWallet = async (publicKey: string): Promise<string> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const data = await response.json();
    return data.token;
  };

  const createWallet = async () => {
    try {
      const keypair = Keypair.random();
      const newPublicKey = keypair.publicKey();
      
      // Store the secret key securely
      localStorage.setItem('secretKey', keypair.secret());
      
      // Register with backend
      const token = await registerWallet(newPublicKey);
      
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('publicKey', newPublicKey);
      
      setPublicKey(newPublicKey);
      setAuthToken(token);
      setIsAuthenticated(true);
      
      // Fetch initial balance
      await updateBalance(newPublicKey);
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  const connectWallet = async (secretKey: string) => {
    try {
      const keypair = Keypair.fromSecret(secretKey);
      const connectedPublicKey = keypair.publicKey();
      
      // Store the secret key securely
      localStorage.setItem('secretKey', secretKey);
      
      // Login with backend
      const token = await loginWallet(connectedPublicKey);
      
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('publicKey', connectedPublicKey);
      
      setPublicKey(connectedPublicKey);
      setAuthToken(token);
      setIsAuthenticated(true);
      
      // Fetch initial balance
      await updateBalance(connectedPublicKey);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setBalance('0');
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('secretKey');
    localStorage.removeItem('authToken');
    localStorage.removeItem('publicKey');
  };

  const sendPayment = async (recipient: string, amount: string) => {
    try {
      const secretKey = localStorage.getItem('secretKey');
      if (!secretKey) {
        throw new Error('No wallet connected');
      }

      const server = new Server('https://horizon-testnet.stellar.org');
      const sourceKeypair = Keypair.fromSecret(secretKey);
      
      const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
      
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET
      })
        .addOperation(Operation.payment({
          destination: recipient,
          asset: Asset.native(),
          amount: amount
        }))
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      await server.submitTransaction(transaction);

      // Update balance after successful payment
      await updateBalance(sourceKeypair.publicKey());
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      publicKey,
      balance,
      isAuthenticated,
      authToken,
      createWallet,
      connectWallet,
      disconnectWallet,
      sendPayment
    }}>
      {children}
    </WalletContext.Provider>
  );
}; 