import Block from "./block";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  constructor() {
    this.blocks = [new Block({
      index: this.nextIndex,
      previousHash: "",
      data: "Genesis Block"
    } as Block
    )];
    this.nextIndex++;
  }

  /**
   * 
   * @returns Block
   * Get the latest block in the blockchain
   */
  getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * 
   * @param block The block to add
   * Add a new block to the blockchain
   */

  addBlock(block: Block): Validation {
    const lastBlock = this.getLatestBlock();

    if(!block.isValid(lastBlock.hash, lastBlock.index ).success) return new Validation(false, 'Invalid block');
    this.blocks.push(block);
    this.nextIndex++;
    return new Validation();
    
  }

  /**
   * @returns boolean
   * Validate the blockchain
   */
  isValid(): Validation {
    for(let i = this.blocks.length -1 ; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index);

      if(!validation.success){
        return new Validation(false, ` Invalid block: ${currentBlock.index} : ${validation.message}`);
      }
    }
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
}