import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

jest.mock('../src/lib/transaction');

describe('Block', () => {

  const exempleDifficulty = 0;
  const exempleMiner = "miner";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      index: 0, 
      previousHash: "", 
      transactions: [new Transaction({
        data: 'Genesis block'
      } as Transaction)]
    } as Block);
  });

  test('Should be valid', () => {
    const block = new Block({index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)]
    } as Block);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(true);
  });

  test('Should create from block info', () => {
    const block = Block.fromBlockInfo({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)],
      difficulty: exempleDifficulty, 
      feePerTx: 1, 
      maxDifficulty: 62
     } as BlockInfo);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(true);
  });

  test('Should be valid (fallbacks)', () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (previous hash)', () => {
    const block = new Block({
      index: 1, 
      previousHash: "", 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (index)', () => {
    const block = new Block({
      index: -1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)]
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (timestamp)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)]
    } as Block);
    block.timestamp = -1;
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (data)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: ''
      } as Transaction)],
    } as Block);
    block.mine(exempleDifficulty, exempleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (empty hash)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)]
    } as Block);
    block.mine(exempleDifficulty, exempleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (no mined)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2'
      } as Transaction)]
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (2 FEEs)', () => {
    const block = new Block({index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: 'Block 2',
        type: TransactionType.FEE
      } as Transaction),
      new Transaction({
        data: 'Block 3',
        type: TransactionType.FEE
      } as Transaction)]
    } as Block);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(false);
  });

  test('Should NOT be valid (tx)', () => {
    const block = new Block({index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: '',
      } as Transaction)]
    } as Block);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(false);
  });

});