import React from 'react';
import WalletConnect from './WalletConnect';
import WalletInfo from './WalletInfo';

const Wallet: React.FC = () => {
    return (
        <div className="wallet-container max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <WalletConnect />
            </div>
            <WalletInfo />
        </div>
    );
};

export default Wallet; 