import { Keypair, Networks, Transaction, TransactionBuilder, Operation, Asset, BASE_FEE } from 'stellar-sdk';
import Server from 'stellar-sdk';

class WalletService {
    private networkPassphrase: string;
    private server: typeof Server;
    private authToken: string | null;

    constructor() {
        this.networkPassphrase = Networks.TESTNET;
        this.server = new Server(import.meta.env.VITE_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org');
        this.authToken = localStorage.getItem('authToken');
    }

    setAuthToken(token: string) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }

    clearAuthToken() {
        this.authToken = null;
        localStorage.removeItem('authToken');
    }

    private async fetchWithAuth(url: string, options: RequestInit = {}) {
        if (!this.authToken) {
            throw new Error('Not authenticated');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.clearAuthToken();
            throw new Error('Authentication failed');
        }

        return response;
    }

    // Create a new wallet
    async createWallet(): Promise<{ publicKey: string; secretKey: string }> {
        const keypair = Keypair.random();
        return {
            publicKey: keypair.publicKey(),
            secretKey: keypair.secret()
        };
    }

    // Register wallet with backend
    async registerWallet(publicKey: string): Promise<string> {
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
        this.setAuthToken(data.token);
        return data.token;
    }

    // Login with existing wallet
    async loginWallet(publicKey: string): Promise<string> {
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
        this.setAuthToken(data.token);
        return data.token;
    }

    // Get wallet balance
    async getBalance(publicKey: string): Promise<{ xlm: string; assets: any[] }> {
        const account = await this.server.loadAccount(publicKey);
        const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native');
        const otherAssets = account.balances.filter((b: any) => b.asset_type !== 'native');
        
        return {
            xlm: xlmBalance ? xlmBalance.balance : '0',
            assets: otherAssets
        };
    }

    // Send XLM
    async sendXLM(fromSecret: string, toPublicKey: string, amount: string): Promise<string> {
        const sourceKeypair = Keypair.fromSecret(fromSecret);
        const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());

        const transaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: this.networkPassphrase
        })
        .addOperation(Operation.payment({
            destination: toPublicKey,
            asset: Asset.native(),
            amount: amount
        }))
        .setTimeout(30)
        .build();

        transaction.sign(sourceKeypair);
        const result = await this.server.submitTransaction(transaction);
        return result.hash;
    }

    // Create trustline for custom assets
    async createTrustline(secretKey: string, assetCode: string, issuer: string): Promise<string> {
        const keypair = Keypair.fromSecret(secretKey);
        const account = await this.server.loadAccount(keypair.publicKey());

        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: this.networkPassphrase
        })
        .addOperation(Operation.changeTrust({
            asset: new Asset(assetCode, issuer)
        }))
        .setTimeout(30)
        .build();

        transaction.sign(keypair);
        const result = await this.server.submitTransaction(transaction);
        return result.hash;
    }

    // Get transaction history
    async getTransactionHistory(publicKey: string): Promise<any[]> {
        const transactions = await this.server.transactions()
            .forAccount(publicKey)
            .order('desc')
            .call();
        return transactions.records;
    }

    // Get rentals (requires authentication)
    async getRentals(): Promise<any[]> {
        const response = await this.fetchWithAuth('/api/rentals');
        if (!response.ok) {
            throw new Error('Failed to fetch rentals');
        }
        return response.json();
    }
}

export const walletService = new WalletService(); 