import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import TransactionType from '../src/lib/transactionType';

jest.mock('../src/lib/transactionInput');

describe('Transaction', () => {

  test('Should be valid (REGULAR default)', () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'carteiraTo'
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeTruthy();
  });

  test('Should NOT be valid (REGULAR with params)', () => {
    const tx = new Transaction({
        txInput: new TransactionInput(),
        to: 'carteiraTo',
        type: TransactionType.REGULAR,
        timestamp: Date.now(),
        hash: 'abc'
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be valid (FEE)', () => {
    const tx = new Transaction({
        txInput: new TransactionInput(),
        to: 'carteiraTo',
        type: TransactionType.FEE
    } as Transaction);

    tx.txInput = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid();

    expect(valid.success).toBeTruthy();
  });


  test('Should be NOT valid (REGULAR) (invalid hash)', () => {
    const tx = new Transaction({
        txInput: new TransactionInput(),
        to: 'carteiraTo'
    } as Transaction);

    tx.hash = 'abc';

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be NOT valid (FEE) (invalid hash)', () => {
    const tx = new Transaction({
        txInput: new TransactionInput(),
        to: 'carteiraTo',
        type: TransactionType.FEE
    } as Transaction);

    tx.hash = 'abc';

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be NOT valid (REGULAR) (invalid to)', () => {
    const tx = new Transaction();

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be NOT valid (REGULAR) (invalid txInput)', () => {
    const tx = new Transaction({
      to: 'carteiraTo',
      txInput: new TransactionInput({
        amount: -10,
        fromAddress: 'carteiraFrom',
        signature: 'abc'
      } as TransactionInput)
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

 
});