import Validation from "./validation";
import sha256 from 'crypto-js/sha256';

/**
 * 
 * TransactionOutput class
 * 
 */

export default class TransactionOutput {
    toAddress: string;
    amount: number;
    tx?: string;

    constructor(txOutput?: TransactionOutput) {
        this.toAddress = txOutput?.toAddress || '';
        this.amount = txOutput?.amount || 0;
        this.tx = txOutput?.tx || '';

    }

    isValid(): Validation {
        if(this.amount < 0) {
            return new Validation(false, 'Invalid amount');
        }
        return new Validation();
    }

    getHash(): string {
        return sha256(this.toAddress + this.amount).toString();
    }
}