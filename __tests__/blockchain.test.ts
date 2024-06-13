import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';

jest.mock('../src/lib/block');

describe('Blockchain', () => {

  test('Should has genesis block', () => {
    const blockchain = new Blockchain();

    expect(blockchain.blocks.length).toEqual(1);
  });

  test('Should add a block', () => {
    const blockchain = new Blockchain();
    const block = new Block({index:1, previousHash: blockchain.getLatestBlock().hash, data: "Block 2"} as Block);
    blockchain.addBlock(block);

    expect(blockchain.blocks.length).toEqual(2);
  });

  test('Should NOT add a block', () => {
    const blockchain = new Blockchain();
    const block = new Block({index:1, previousHash: blockchain.getLatestBlock().hash, data: "Block 2"} as Block);
    block.hash = "";
    block.data = "";
    block.index = -1;

    blockchain.addBlock(block);

    expect(blockchain.blocks.length).toEqual(1);
  });

  test('Should NOT valid blockchain', () => {
    const blockchain = new Blockchain();
    const block = new Block({index:1, previousHash: blockchain.getLatestBlock().hash, data: "Block 2"} as Block);
    blockchain.addBlock(block);

    block.hash = "";
    block.data = "";
    block.index = -1;

    expect(blockchain.isValid().success).toEqual(false);
  });

  test('Should valid blockchain', () => {
    const blockchain = new Blockchain();
    const block = new Block({index:1, previousHash: blockchain.getLatestBlock().hash, data: "Block 2"} as Block);
    blockchain.addBlock(block);

    expect(blockchain.isValid().success).toEqual(true);
  }
  );

  test('Should get block', () => {
    const blockchain = new Blockchain();
    const block = new Block({index:1, previousHash: blockchain.getLatestBlock().hash, data: "Block 2"} as Block);
    blockchain.addBlock(block);

    const foundBlock = blockchain.getBlock(blockchain.blocks[1].hash)

    expect(foundBlock).toBeTruthy();
  });

  
});