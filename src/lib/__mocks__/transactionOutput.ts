import Validation from "../validation";

/**
 * 
 * TransactionOutput class mocked
 * 
 */

export default class TransactionOutput {
    toAddress: string;
    amount: number;
    tx?: string;

    constructor(txOutput?: TransactionOutput) {
        this.toAddress = txOutput?.toAddress || "abc";
        this.amount = txOutput?.amount || 10;
        this.tx = txOutput?.tx || "xyz";
    }

    isValid(): Validation {
        if(this.amount < 1) {
            return new Validation(false, 'Invalid amount');
        }
        return new Validation();
    }

    getHash(): string {
        return 'abc';
    }
}