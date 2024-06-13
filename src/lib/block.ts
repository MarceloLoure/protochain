import sha256 from 'crypto-js/sha256';
import Validation from './validation';

/**
 * Block class
*/

export default class Block {

    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    data: string;

    /**
     * 
     * @param index The index of the block
     * @param timestamp The timestamp of the block
     * @param hash The hash of the block
     * @param previousHash The previous hash of the block
     * @param data The data of the block
     */
    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.data = block?.data || "";
        this.hash = block?.hash || this.getHash();
    }

    /**
     * 
     * @returns boolean
     * Check if the block is valid
     */
    isValid(previousHash: string, previousIndex: number ): Validation {
       if (previousIndex !== this.index -1) return new Validation(false, 'Invalid index.');
       if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp.');
       if (!this.data) return new Validation(false, 'Invalid data.');
       if (this.previousHash !== previousHash) return new Validation(false, 'Invalid previous hash.');
       if (!this.hash) return new Validation(false, 'Invalid hash.');

       return new Validation();
    }

    /**
     * 
     * @returns string
     * Get the hash of the block
     */
    getHash(): string {
        return sha256(this.index + this.previousHash + this.timestamp + this.data).toString();
    }
}