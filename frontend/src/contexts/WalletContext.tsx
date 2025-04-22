import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { Keypair } from 'stellar-sdk';

interface WalletState {
    publicKey: string | null;
    secretKey: string | null;
    balance: {
        xlm: string;
        assets: any[];
    } | null;
    isConnected: boolean;
}

interface WalletContextType extends WalletState {
    createWallet: () => Promise<void>;
    connectWallet: (secretKey: string) => Promise<void>;
    disconnectWallet: () => void;
    sendXLM: (toPublicKey: string, amount: string) => Promise<string>;
    refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WalletState>({
        publicKey: null,
        secretKey: null,
        balance: null,
        isConnected: false
    });

    useEffect(() => {
        // Load wallet from localStorage if exists
        const savedWallet = localStorage.getItem('wallet');
        if (savedWallet) {
            const { publicKey, secretKey } = JSON.parse(savedWallet);
            connectWallet(secretKey);
        }
    }, []);

    const createWallet = async () => {
        const { publicKey, secretKey } = await walletService.createWallet();
        setState(prev => ({
            ...prev,
            publicKey,
            secretKey,
            isConnected: true
        }));
        localStorage.setItem('wallet', JSON.stringify({ publicKey, secretKey }));
        await refreshBalance();
    };

    const connectWallet = async (secretKey: string) => {
        try {
            const keypair = Keypair.fromSecret(secretKey);
            setState(prev => ({
                ...prev,
                publicKey: keypair.publicKey(),
                secretKey,
                isConnected: true
            }));
            localStorage.setItem('wallet', JSON.stringify({
                publicKey: keypair.publicKey(),
                secretKey
            }));
            await refreshBalance();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw new Error('Invalid secret key');
        }
    };

    const disconnectWallet = () => {
        setState({
            publicKey: null,
            secretKey: null,
            balance: null,
            isConnected: false
        });
        localStorage.removeItem('wallet');
    };

    const sendXLM = async (toPublicKey: string, amount: string) => {
        if (!state.secretKey) throw new Error('Wallet not connected');
        const txHash = await walletService.sendXLM(state.secretKey, toPublicKey, amount);
        await refreshBalance();
        return txHash;
    };

    const refreshBalance = async () => {
        if (!state.publicKey) return;
        const balance = await walletService.getBalance(state.publicKey);
        setState(prev => ({
            ...prev,
            balance
        }));
    };

    return (
        <WalletContext.Provider value={{
            ...state,
            createWallet,
            connectWallet,
            disconnectWallet,
            sendXLM,
            refreshBalance
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}; 