import Block from '../src/lib/block';

describe('Block', () => {

  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({index: 0, previousHash: "", data: "Genesis Block"} as Block);
  });

  test('Should be valid', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toEqual(true);
  });

  test('Should be valid (fallbacks)', () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (previous hash)', () => {
    const block = new Block({index: 1, previousHash: "", data:"block 2"} as Block);
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (index)', () => {
    const block = new Block({index: -1, previousHash: genesis.hash, data:"Block 2"} as Block);
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (timestamp)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);
    block.timestamp = -1;
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (data)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:""} as Block);
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toBeFalsy();
  });

  test('Should NOT be valid (hash)', () => {
    const block = new Block({index: 1, previousHash: genesis.hash, data:"Block 2"} as Block);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index);

    expect(valid.success).toBeFalsy();
  });

});