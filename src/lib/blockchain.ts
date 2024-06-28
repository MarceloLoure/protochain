import Block from "./block";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "./transactionSearch";
import TransactionType from "./transactionType";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[] = [];
  nextIndex: number = 0;
  static readonly DIFFICULTY_FACTORY: number = 5;
  static readonly MAX_DIFFICULTY: number = 62;
  static readonly TX_PER_BLOCK: number = 2;

  constructor() {
    this.blocks = [new Block({
      index: this.nextIndex,
      previousHash: "",
      transactions: [new Transaction({
        type: TransactionType.FEE,
        data: new Date().toString()
      } as Transaction)]
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
   * @returns number
   * Get the difficulty of the blockchain
   */
  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTORY);
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();

    if(!validation.success)
      return new Validation(false, "Invalid transaction: " + validation.message);

    if(this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash)))
      return new Validation(false, "Transaction already in blockchain");

    if(this.mempool.some(tx => tx.hash === transaction.hash)) 
      return new Validation(false, "Transaction already in mempool");

    this.mempool.push(transaction);
    return new Validation(true, transaction.hash);
  }

  /**
   * 
   * @param block The block to add
   * Add a new block to the blockchain
   */

  addBlock(block: Block): Validation {
    const lastBlock = this.getLatestBlock();

    if(!block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty() ).success) return new Validation(false, 'Invalid block');

    const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE).map(tx => tx.hash);
    const newMemPool = this.mempool.filter(tx => !txs.includes(tx.hash));
    
    if(newMemPool.length + txs.length !== this.mempool.length) return new Validation(false, 'Invalid tx in block: mempool');

    this.blocks.push(block);
    this.nextIndex++;
    return new Validation(true, block.hash);
    
  }

  /**
   * @returns boolean
   * Validate the blockchain
   */
  isValid(): Validation {
    for(let i = this.blocks.length -1 ; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());

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

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash);
    if(mempoolIndex !== -1) {
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex]
      } as TransactionSearch;
    }

    const blockIndex = this.blocks.findIndex(block => block.transactions.some(tx => tx.hash === hash));

    if(blockIndex !== -1) {
      return {
        blockIndex,
        transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash === hash) as Transaction
      } as TransactionSearch;
    }

    return { blockIndex: -1, mempoolIndex: -1} as TransactionSearch;
  }

  /**
   * 
   * @returns Fee per transaction
   * Get a fee per transaction
   */
  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo | null {
    if(!this.mempool || !this.mempool.length) {
      return null;
    }

    const transactions = this.mempool.splice(0, Blockchain.TX_PER_BLOCK);

    const difficulty = this.getDifficulty();
    const previousHash = this.getLatestBlock().hash;
    const index = this.blocks.length;
    const feePerTx =this.getFeePerTx();
    const maxDifficulty = Blockchain.MAX_DIFFICULTY;

    return {index, previousHash, difficulty, maxDifficulty, feePerTx, transactions} as BlockInfo;
  }
}