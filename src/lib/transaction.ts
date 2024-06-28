import TransactionType from "./transactionType";
import sha256 from 'crypto-js/sha256';
import Validation from "./validation";

/*
* This class will be used to create a transaction object
*/

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    data: string;

    constructor(tx? : Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "";
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return sha256(this.type + this.timestamp + this.data).toString();
    }

    isValid(): Validation {
        if(this.hash !== this.getHash()) return new Validation(false, 'Invalid hash.');
        if(!this.data) return new Validation(false, 'Invalid data.');

        return new Validation();
    }

}