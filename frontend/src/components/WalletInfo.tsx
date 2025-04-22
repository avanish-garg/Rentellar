import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import styles from './Wallet.module.css';

const WalletInfo: React.FC = () => {
    const { publicKey, balance, sendPayment } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSendPayment = async () => {
        try {
            setError(null);
            setSuccess(null);
            await sendPayment(recipient, amount);
            setSuccess('Payment sent successfully!');
            setRecipient('');
            setAmount('');
        } catch (err) {
            setError('Failed to send payment');
            console.error(err);
        }
    };

    return (
        <div className={styles.walletInfo}>
            <div className={styles.balanceInfo}>
                <h3>Balance</h3>
                <p>{balance} XLM</p>
            </div>

            <div className={styles.sendXlm}>
                <h3>Send XLM</h3>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Recipient's public key"
                    className={styles.recipientInput}
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className={styles.amountInput}
                />
                <button onClick={handleSendPayment} className={styles.sendBtn}>
                    Send
                </button>
            </div>

            <div className={styles.publicKeyInfo}>
                <h3>Public Key</h3>
                <p className={styles.publicKey}>{publicKey}</p>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
        </div>
    );
};

export default WalletInfo; 