import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import styles from './Wallet.module.css';

const WalletConnect: React.FC = () => {
    const { createWallet, connectWallet, disconnectWallet, isConnected, publicKey } = useWallet();
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreateWallet = async () => {
        try {
            setError(null);
            await createWallet();
        } catch (err) {
            setError('Failed to create wallet');
            console.error(err);
        }
    };

    const handleConnectWallet = async () => {
        try {
            setError(null);
            await connectWallet(secretKey);
            setSecretKey('');
        } catch (err) {
            setError('Invalid secret key');
            console.error(err);
        }
    };

    const handleDisconnect = () => {
        disconnectWallet();
    };

    return (
        <div className={styles.walletConnect}>
            {!isConnected ? (
                <div className={styles.connectOptions}>
                    <button onClick={handleCreateWallet} className={styles.createWalletBtn}>
                        Create New Wallet
                    </button>
                    <div className={styles.connectExisting}>
                        <input
                            type="password"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder="Enter your secret key"
                            className={styles.secretKeyInput}
                        />
                        <button onClick={handleConnectWallet} className={styles.connectBtn}>
                            Connect Wallet
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.walletConnected}>
                    <p className={styles.publicKey}>
                        Connected: {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                    </p>
                    <button onClick={handleDisconnect} className={styles.disconnectBtn}>
                        Disconnect
                    </button>
                </div>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default WalletConnect; 