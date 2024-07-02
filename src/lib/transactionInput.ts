import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import sha256 from 'crypto-js/sha256';
import Validation from './validation';

const ECPair = ECPairFactory(ecc);

/**
 * TransactionInput class
 */

export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Create a new transaction input
     * @param txInput
     * 
     */
    constructor(txInput?: TransactionInput) {
        this.fromAddress = txInput?.fromAddress || "";
        this.amount = txInput?.amount || 0;
        this.signature = txInput?.signature || "";
    }

    /**
     * Generate a signature for the transaction input
     * @param privateKey
     */
    sign(privateKey: string): void {
        this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
            .sign(Buffer.from(this.getHash(), "hex"))
            .toString("hex");
    }

    /**
     * Get the hash of the transaction input
     * @returns string - 
     */
    getHash(): string {
        return sha256(this.fromAddress + this.amount ).toString();
    }

    /**
     * Validate the transaction input
     * @returns Validation - 
     */
    isValid(): Validation {
        if(!this.signature) return new Validation(false, 'Invalid signature.');

        if(this.amount < 1) return new Validation(false, 'Amount must be greater than 0.');

        const hash = Buffer.from(this.getHash(), 'hex');
        const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAddress, 'hex'))
            .verify(hash, Buffer.from(this.signature, 'hex'));

        return isValid ? new Validation() : new Validation(false, 'Invalid tx input signature.');
    }

}