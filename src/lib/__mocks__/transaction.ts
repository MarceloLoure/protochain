import TransactionType from "../transactionType";
import sha256 from 'crypto-js/sha256';
import Validation from "../validation";
import TransactionInput from "./transactionInput";

/*
* MOCKED This class will be used to create a transaction object
*/

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string | undefined;
    to: string;
    txInput: TransactionInput;

    constructor(tx? : Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "carteiraTo";
        
        if(tx && tx.txInput){
            this.txInput = new TransactionInput(tx.txInput);
        } else {
            this.txInput = new TransactionInput();
        }

        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return 'abc'
    }

    isValid(): Validation {
        if(!this.to) return new Validation(false, 'Invalid mocked data.');

        if(!this.txInput.isValid().success) return new Validation(false, 'Invalid mocked txInput.');

        return new Validation();
    }

}