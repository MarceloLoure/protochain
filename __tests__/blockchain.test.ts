import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe('Blockchain', () => {

  test('Should has genesis block', () => {
    const blockchain = new Blockchain();

    expect(blockchain.blocks.length).toEqual(1);
  });

  test('Should add a block', () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      txInput: new TransactionInput()
    } as Transaction)

    blockchain.mempool.push(tx);

    const block = new Block({
      index: 1, 
      previousHash: blockchain.getLatestBlock().hash,
      transactions: [tx]
    } as Block);
    blockchain.addBlock(block);

    expect(blockchain.blocks.length).toEqual(2);
  });

  test('Should NOT add a block', () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      txInput: new TransactionInput()
    } as Transaction)

    blockchain.mempool.push(tx);

    const block = new Block({
      index: 1, 
      previousHash: blockchain.getLatestBlock().hash,
      transactions: [tx]
    } as Block);
    block.hash = "";
    block.transactions = [];
    block.index = -1;

    blockchain.addBlock(block);

    expect(blockchain.blocks.length).toEqual(1);
  });

  test('Should NOT valid blockchain', () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      txInput: new TransactionInput()
    } as Transaction)

    blockchain.mempool.push(tx);

    const block = new Block({
      index: 1, 
      previousHash: blockchain.getLatestBlock().hash,
      transactions: [tx]
    } as Block);
    blockchain.addBlock(block);

    block.hash = "";
    block.transactions = [];
    block.index = -1;

    expect(blockchain.isValid().success).toEqual(false);
  });

  test('Should valid blockchain', () => {
    const blockchain = new Blockchain();
    const block = new Block({
      index: 1, 
      previousHash: blockchain.getLatestBlock().hash,
      transactions: [new Transaction({
        txInput: new TransactionInput()
      } as Transaction)]
    } as Block);
    blockchain.addBlock(block);

    expect(blockchain.isValid().success).toEqual(true);
  }
  );

  test('Should get block', () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      txInput: new TransactionInput()
    } as Transaction)

    blockchain.mempool.push(tx);

    const block = new Block({
      index: 1, 
      previousHash: blockchain.getLatestBlock().hash,
      transactions: [tx]
    } as Block);

    blockchain.addBlock(block);

    const foundBlock = blockchain.getBlock(blockchain.blocks[1].hash)

    expect(foundBlock).toBeTruthy();
  });

  test("Should get next block info", () => {
    const blockchain = new Blockchain();
    
    blockchain.mempool.push(new Transaction());
    
    const info = blockchain.getNextBlock();

    expect(info ? info.index : 0).toEqual(1);
  });

  test("Should NOT get next block info", () => {
    const blockchain = new Blockchain();
  
    const info = blockchain.getNextBlock();

    expect(info).toBeNull();
  });

  test("Should add transaction", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'hash1'
    } as Transaction)

    const validation = blockchain.addTransaction(tx);

    expect(validation.success).toEqual(true);
  });

  test("Should NOT add transaction (pending tx)", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'hash1'
    } as Transaction)
    blockchain.addTransaction(tx);
 
    const tx2 = new Transaction({
      txInput: new TransactionInput(),
      hash: 'hash1'
    } as Transaction)

    const validation = blockchain.addTransaction(tx2);

    expect(validation.success).toBeFalsy();
  });
  
  test("Should ALREADY IN BLOCKCHAIN add transaction", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: ''
    } as Transaction)

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(false);
  });

  test("Should ALREADY IN MEMPOOL add transaction", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: ''
    } as Transaction)

    blockchain.mempool.push(tx);

    const validation = blockchain.addTransaction(tx);

    expect(validation.success).toEqual(false);
  });

  test("Should get transaction MEMPOOL", () => {
    const blockchain = new Blockchain();
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'abc'
    } as Transaction)

    blockchain.mempool.push(tx);

    const result = blockchain.getTransaction('abc');

    expect(result.mempoolIndex).toEqual(0);
  });

  test("Should get transaction BLOCK", () => {
   
    const blockchain = new Blockchain();
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'abc'
    } as Transaction)

    blockchain.blocks.push(new Block({
        transactions: [tx]
      } as Block));

    const result = blockchain.getTransaction('abc');

    expect(result.blockIndex).toEqual(0);
  });

  test("Should get transaction NOT EXIST", () => {
    const blockchain = new Blockchain();
    const result = blockchain.getTransaction('xyz');

    expect(result.blockIndex).toEqual(-1);
    expect(result.mempoolIndex).toEqual(-1);
  });

  test('Should NOT add transaction(invalid tx)', () => {
    const blockchain = new Blockchain();

    const txInput = new TransactionInput();
    txInput.amount = -10;

    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'abc'
    } as Transaction)

    const validation = blockchain.addTransaction(tx);

    expect(validation.success).toEqual(false);
  })

  
});