import { Keypair, TransactionBuilder, Operation, Asset, Networks, BASE_FEE } from 'stellar-sdk';
import Server from 'stellar-sdk';

export class StellarService {
    private server: typeof Server;
    private networkPassphrase: string;

    constructor() {
        this.server = new Server('https://horizon-testnet.stellar.org');
        this.networkPassphrase = Networks.TESTNET;
    }

    async createEscrowAccount(
        ownerSecretKey: string,
        renterPublicKey: string,
        amount: string
    ): Promise<{ escrowPublicKey: string; transactionHash: string }> {
        const ownerKeypair = Keypair.fromSecret(ownerSecretKey);
        const escrowKeypair = Keypair.random();

        const sourceAccount = await this.server.loadAccount(ownerKeypair.publicKey());

        const transaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(Operation.createAccount({
                destination: escrowKeypair.publicKey(),
                startingBalance: amount,
            }))
            .addOperation(Operation.setOptions({
                source: escrowKeypair.publicKey(),
                masterWeight: 0,
                lowThreshold: 2,
                medThreshold: 2,
                highThreshold: 2,
                signer: {
                    ed25519PublicKey: ownerKeypair.publicKey(),
                    weight: 1,
                },
            }))
            .addOperation(Operation.setOptions({
                source: escrowKeypair.publicKey(),
                signer: {
                    ed25519PublicKey: renterPublicKey,
                    weight: 1,
                },
            }))
            .setTimeout(30)
            .build();

        transaction.sign(ownerKeypair, escrowKeypair);
        const result = await this.server.submitTransaction(transaction);

        return {
            escrowPublicKey: escrowKeypair.publicKey(),
            transactionHash: result.hash,
        };
    }

    async processRentalPayment(
        renterSecretKey: string,
        escrowPublicKey: string,
        amount: string
    ): Promise<string> {
        const renterKeypair = Keypair.fromSecret(renterSecretKey);
        const sourceAccount = await this.server.loadAccount(renterKeypair.publicKey());

        const transaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(Operation.payment({
                destination: escrowPublicKey,
                asset: Asset.native(),
                amount: amount,
            }))
            .setTimeout(30)
            .build();

        transaction.sign(renterKeypair);
        const result = await this.server.submitTransaction(transaction);
        return result.hash;
    }

    async completeRental(
        ownerSecretKey: string,
        renterSecretKey: string,
        escrowPublicKey: string,
        ownerAmount: string,
        renterAmount: string
    ): Promise<string> {
        const ownerKeypair = Keypair.fromSecret(ownerSecretKey);
        const renterKeypair = Keypair.fromSecret(renterSecretKey);
        const escrowAccount = await this.server.loadAccount(escrowPublicKey);

        const transaction = new TransactionBuilder(escrowAccount, {
            fee: BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(Operation.payment({
                source: escrowPublicKey,
                destination: ownerKeypair.publicKey(),
                asset: Asset.native(),
                amount: ownerAmount,
            }))
            .addOperation(Operation.payment({
                source: escrowPublicKey,
                destination: renterKeypair.publicKey(),
                asset: Asset.native(),
                amount: renterAmount,
            }))
            .addOperation(Operation.accountMerge({
                source: escrowPublicKey,
                destination: ownerKeypair.publicKey(),
            }))
            .setTimeout(30)
            .build();

        transaction.sign(ownerKeypair, renterKeypair);
        const result = await this.server.submitTransaction(transaction);
        return result.hash;
    }

    async getBalance(publicKey: string): Promise<string> {
        const account = await this.server.loadAccount(publicKey);
        const balance = account.balances.find(b => b.asset_type === 'native');
        return balance ? balance.balance : '0';
    }
}

export const stellarService = new StellarService(); 