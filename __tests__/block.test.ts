import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';

describe('Block', () => {

  const exempleDifficulty = 0;
  const exempleMiner = "miner";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({index: 0, previousHash: "", data: "Genesis Block"} as Block);
  });

  test('Should be valid', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);

    block.mine(exempleDifficulty, exempleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toEqual(true);
  });

  test('Should create from block info', () => {
    const block = Block.fromBlockInfo({index: 1, previousHash: genesis.hash, data:"Block 2", difficulty: exempleDifficulty, feePerTx: 1, maxDifficulty: 62 } as BlockInfo);

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
    const block = new Block({index: 1, previousHash: "", data:"block 2"} as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (index)', () => {
    const block = new Block({index: -1, previousHash: genesis.hash, data:"Block 2"} as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (timestamp)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);
    block.timestamp = -1;
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (data)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:""} as Block);
    block.mine(exempleDifficulty, exempleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (empty hash)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);
    block.mine(exempleDifficulty, exempleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (no mined)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);

    expect(valid.success).toBeFalsy();
  });

});