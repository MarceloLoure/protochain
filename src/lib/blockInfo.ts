import Transaction from "./transaction";

/**
 * BlockInfo interface
 * @interface BlockInfo
 * @param {number} index - The index of the block
 * @param {string} previousHash - The previous hash of the block
 * @param {number} difficulty - The difficulty of the block
 * @param {number} maxDifficulty - The max difficulty of the block
 * @param {number} feePerTx - The fee per transaction of the block
 * @param {Transaction} transactions - The transactions of the block
 */
export default interface BlockInfo {
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
    transactions: Transaction[];
}