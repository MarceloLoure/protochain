import TransactionType from "../transactionType";
import sha256 from 'crypto-js/sha256';
import Validation from "../validation";

/*
* MOCKED This class will be used to create a transaction object
*/

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string | undefined;
    data: string;

    constructor(tx? : Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "";
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return 'abc'
    }

    isValid(): Validation {
        if(!this.data) return new Validation(false, 'Invalid data.');

        return new Validation();
    }

}