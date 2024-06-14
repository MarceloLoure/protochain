import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  constructor() {
    this.blocks = [new Block({
        index: 0,
        hash: "abc",
        previousHash: "",
        timestamp: Date.now(),
        data: "Genesis Block"
    } as Block
    )];
    this.nextIndex++;
  }

  /**
   * 
   * @returns Block mocked
   * Get the latest block mocked in the blockchain
   */
  getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * 
   * @param block The block to add mocked
   * Add a new block to the blockchain
   */

  addBlock(block: Block): Validation {
    if(block.index < 0) return new Validation(false, "Invalid mock block");

    this.blocks.push(block);
    this.nextIndex++;
    return new Validation();
    
  }

  /**
   * @returns boolean
   * Validate the blockchain
   */
  isValid(): Validation {
    return  new Validation();
  }

  /**
   * 
   * @param hash The hash of the block
   * @returns Block
   * Get a block by its hash
   */
  getBlock(hash: string): Block | undefined {
    return this.blocks.find(block => block.hash === hash);
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    const data = new Date().toString();
    const difficulty = 0;
    const previousHash = this.getLatestBlock().hash;
    const index = this.blocks.length;
    const feePerTx =this.getFeePerTx();
    const maxDifficulty = 62;

    return {index, previousHash, difficulty, maxDifficulty, feePerTx, data} as BlockInfo;
  }
}