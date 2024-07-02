import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import TransactionType from '../src/lib/transactionType';

jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe('Block', () => {

  const exempleDifficulty = 1;
  const exempleMiner = "miner";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      index: 0, 
      previousHash: "", 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);
  });

  test('Should be valid', () => {
    const block = new Block({index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(true);
  });

  test('Should NOT be valid (no fee)', () => {
    const block = new Block({index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should create from block info', () => {
    const block = Block.fromBlockInfo({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)],
      difficulty: exempleDifficulty, 
      feePerTx: 1, 
      maxDifficulty: 62
     } as BlockInfo);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

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
        txInput: new TransactionInput(),
      } as Transaction)],
    } as Block);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (index)', () => {
    const block = new Block({
      index: -1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (timestamp)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);
    block.timestamp = -1;

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (txInput)', () => {
    const txInput = new TransactionInput();
    txInput.amount = -1;

    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput
      } as Transaction)],
    } as Block);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (empty hash)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);
    block.mine(exempleDifficulty, exempleMiner);
    block.hash = "";

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (invalid tx)', () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exempleDifficulty, exempleMiner);
    block.transactions[0].to = "";
    
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (no mined)', () => {
    const block = new Block({
      index: 1, 
      nonce: 0,
      miner: exempleMiner,
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      to: exempleMiner,
      type: TransactionType.FEE
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (2 FEEs)', () => {
    const block = new Block({index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
        type: TransactionType.FEE
      } as Transaction),
      new Transaction({
        txInput: new TransactionInput(),
        type: TransactionType.FEE
      } as Transaction)]
    } as Block);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(false);
  });

});