import TransactionType from "../transactionType";
import sha256 from 'crypto-js/sha256';
import Validation from "../validation";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/*
* MOCKED This class will be used to create a transaction object
*/

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string | undefined;
    txInputs: TransactionInput[] | undefined;
    txOutputs: TransactionOutput[] | undefined;

    constructor(tx? : Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.txOutputs = tx?.txOutputs || [new TransactionOutput()];
        this.txInputs = tx?.txInputs || [new TransactionInput()];

        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return 'abc'
    }

    isValid(difficulty: number, totalFees: number): Validation {
        if(this.timestamp < 1 || !this.hash || difficulty < 1 || totalFees < 0) return new Validation(false, 'Invalid mocked data.');

        return new Validation();
    }

    static fromReward(txo: TransactionOutput): Transaction {
        const tx = new Transaction({
            type: TransactionType.FEE,
            txOutputs: [txo]
        } as Transaction);

        tx.txInputs = undefined;
        tx.hash = tx.getHash();

        return tx;
    }

}