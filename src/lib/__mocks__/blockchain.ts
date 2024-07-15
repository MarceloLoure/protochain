import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import Transaction from "../transaction";
import TransactionType from "../transactionType";
import TransactionSearch from "../transactionSearch";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[] = [];
  nextIndex: number = 0;

  constructor(miner: string) {
    this.blocks = [];
    this.mempool = [new Transaction()];

    this.blocks.push(new Block({
        index: 0,
        hash: "abc",
        previousHash: "",
        miner: miner,
        timestamp: Date.now(),
    } as Block
    ));
    this.nextIndex++;
  }

  /**
   * 
   * @returns Block mocked
   * Get the latest block mocked in the blockchain
   */
  getLastBlock(): Block {
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

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid(1, 10);
    if (!validation.success) return validation;

    this.mempool.push(transaction);
    return new Validation();
  }

  getTransaction(hash: string): TransactionSearch {
    if (hash === "-1")
        return { mempoolIndex: -1, blockIndex: -1 } as TransactionSearch;

    return {
        mempoolIndex: 0,
        transaction: new Transaction()
    } as TransactionSearch;
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
    if(!hash || hash === '-1'){
      return undefined
    }
    return this.blocks.find(block => block.hash === hash);
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    const transactions= this.mempool.slice(0,2);
    const difficulty = 2;
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx =this.getFeePerTx();
    const maxDifficulty = 62;

    return {index, previousHash, difficulty, maxDifficulty, feePerTx, transactions} as BlockInfo;
  }

  getTxInputs(wallet: string): (TransactionInput | undefined)[] {
    return [new TransactionInput({
      amount: 10,
      fromAddress: wallet,
      previousTx:'abc',
      signature: "abc",
    } as TransactionInput)];
  }

  getTxOutputs(wallet: string): TransactionOutput[] {
    return [new TransactionOutput({
      amount: 10,
      toAddress: wallet,
      tx: 'abc',
    } as TransactionOutput)];
  }

  getUtxo(wallet: string): TransactionOutput[] {
    return this.getTxOutputs(wallet);
  }

  getBalance(wallet: string): number {
    return 10;
  }
}