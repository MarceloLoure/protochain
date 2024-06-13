import Validation from '../validation';

/**
 * Mocked block class
 */

export default class Block {

    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    data: string;

    /**
     * 
     * @param index The index of the mock block
     * @param timestamp The timestamp of the mock block
     * @param hash The hash of the mock block
     * @param previousHash The previous hash of the mock block
     * @param data The data of the mock block
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
     * Check if the mock block is valid
     */
    isValid(previousHash: string, previousIndex: number ): Validation {
       if(!previousHash || previousIndex < 0 || this.index < 0){
              return new Validation(false, 'Invalid mock block');
       }
       return new Validation();
    }

    /**
     * 
     * @returns string
     * Get the hash fake of the block
     */
    getHash(): string {
        return this.hash || "baseHash"
    }
}