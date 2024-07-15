
import Validation from '../validation';

/**
 * Mocked TransactionInput class
 */

export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;
    previousTx: string;

    /**
     * Create a new transaction input
     * @param txInput
     * 
     */
    constructor(txInput?: TransactionInput) {
        this.fromAddress = txInput?.fromAddress || "carteira1";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "abc";
        this.previousTx = txInput?.previousTx || "xyz";
    }

    /**
     * Generate a signature for the transaction input
     * @param privateKey
     */
    sign(privateKey: string): void {
        this.signature = 'abc'
    }

    /**
     * Get the hash of the transaction input
     * @returns string - 
     */
    getHash(): string {
        return 'abc';
    }

    /**
     * Validate the transaction input
     * @returns Validation - 
     */
    isValid(): Validation {
        if (!this.previousTx || !this.signature)
            return new Validation(false, "Signature and previous TX are required.");

        if (this.amount < 1)
            return new Validation(false, "Amount must be greater than zero.");

        return new Validation();
    }

}