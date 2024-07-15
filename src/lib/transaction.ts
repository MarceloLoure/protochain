import TransactionType from "./transactionType";
import sha256 from 'crypto-js/sha256';
import Validation from "./validation";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";
import Blockchain from "./blockchain";

/*
* This class will be used to create a transaction object
*/

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    txInputs: TransactionInput[] | undefined;
    txOutputs: TransactionOutput[];


    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.txInputs = tx?.txInputs ? tx.txInputs.map(txInput => new TransactionInput(txInput)) : undefined;
        this.txOutputs = tx?.txOutputs ? tx.txOutputs.map(txOutput => new TransactionOutput(txOutput)) : [];
        this.hash = tx?.hash || this.getHash();

        this.txOutputs.forEach((txo, index, arr) => arr[index].tx = this.hash);
    }

    getHash(): string {
        const from = this.txInputs && this.txInputs.length > 0 ? this.txInputs.map(txInput => txInput.signature).join(',') : '';

        const to = this.txOutputs && this.txOutputs.length > 0 ? this.txOutputs.map(txOutput => txOutput.getHash()).join(',') : '';

        return sha256(this.type + from + to + this.timestamp).toString();
    }

    getFee(): number {
        let inputSum: number = 0;
        let outputSum: number = 0;

        if(this.txInputs && this.txInputs.length){
            inputSum = this.txInputs.map(txi => txi.amount).reduce((a, b) => a + b);

            if(this.txOutputs && this.txOutputs.length){
                outputSum = this.txOutputs.map(txo => txo.amount).reduce((a, b) => a + b);
            }

            return inputSum - outputSum;
        }
        return 0;
    }

    isValid(difficulty: number, totalFees: number): Validation {
        if(this.hash !== this.getHash()) return new Validation(false, 'Invalid hash.');

        if(!this.txOutputs || !this.txOutputs.length || this.txOutputs.map(txo => txo.isValid()).some(v => !v.success)) return new Validation(false, 'Invalid TXO.');

        if(this.txInputs && this.txInputs.length){
            const validation = this.txInputs.map(txi => txi.isValid()).filter(v => !v.success);
            if(validation && validation.length){
                const message = validation.map(v => v.message).join(' ');
                return new Validation(false, `Invalid txInput: ${message}`);
            }

            const inputSum = this.txInputs.reduce((acc, txi) => acc + txi.amount, 0);
            const outputSum = this.txOutputs.reduce((acc, txo) => acc + txo.amount, 0);

            if(inputSum < outputSum) return new Validation(false, 'Invalid tx: input amouts must be equals our greater than outputs amounts.');
        }

        if(this.txOutputs.some(txo => txo.tx !== this.hash)) return new Validation(false, 'Invalid txOutput reference hash.');

        if(this.type === TransactionType.FEE) {
            const txo = this.txOutputs[0];

            if(txo.amount > Blockchain.getRewardAmount(difficulty)  + totalFees){
                return new Validation(false, 'Invalid tx reward.');
            }
        }


        return new Validation();
    }

    static fromReward(txo: TransactionOutput): Transaction {
        const tx = new Transaction({
            type: TransactionType.FEE,
            txOutputs: [txo]
        } as Transaction);

        tx.hash = tx.getHash();
        tx.txOutputs[0].tx = tx.hash;

        return tx;
    }

}