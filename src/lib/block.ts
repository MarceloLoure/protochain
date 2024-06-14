import sha256 from 'crypto-js/sha256';
import Validation from './validation';
import BlockInfo from './blockInfo';

/**
 * Block class
*/

export default class Block {

    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    nonce: number;
    miner: string;
    data: string;

    /**
     * 
     * @param index The index of the block
     * @param timestamp The timestamp of the block
     * @param hash The hash of the block
     * @param previousHash The previous hash of the block
     * @param nonce The nonce of the block
     * @param miner The miner of the block
     * @param data The data of the block
     */
    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.nonce = block?.nonce || 0;
        this.miner = block?.miner || "";
        this.data = block?.data || "";
        this.hash = block?.hash || this.getHash();
    }

    /**
     * @param previousHash The previous hash of the block
     * @param previousIndex The previous index of the block
     * @param difficulty The difficulty of the block
     * @returns boolean
     * Check if the block is valid
     */
    isValid(previousHash: string, previousIndex: number, difficulty: number ): Validation {
       if (previousIndex !== this.index -1) return new Validation(false, 'Invalid index.');
       if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp.');
       if (!this.data) return new Validation(false, 'Invalid data.');
       if (this.previousHash !== previousHash) return new Validation(false, 'Invalid previous hash.');
       if (!this.nonce || !this.miner) return new Validation(false, 'Not nined block.');

       const prefix = new Array(difficulty + 1).join('0');

       if (this.hash !== this.getHash() || !this.hash.startsWith(prefix)) return new Validation(false, 'Invalid hash.');

       return new Validation();
    }

    /**
     * 
     * @returns string
     * Get the hash of the block
     */
    getHash(): string {
        return sha256(this.index + this.previousHash + this.timestamp + this.data + this.nonce + this.miner).toString();
    }

    /**
     * 
     * @param difficulty The difficulty of the block
     * @param miner The miner wallet address
     * Mine the block
     */
    mine(difficulty: number, miner: string) {
        this.miner = miner;

        const prefix = new Array(difficulty + 1).join('0');

        do {
            this.nonce++;
            this.hash = this.getHash();
        }
        while (!this.hash.startsWith(prefix));
    }

    static fromBlockInfo(blockInfo: BlockInfo): Block {
        const block = new Block();
        block.index = blockInfo.index;
        block.previousHash = blockInfo.previousHash;
        block.data = blockInfo.data;

        return block;
    }
}