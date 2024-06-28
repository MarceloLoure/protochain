import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

describe('Transaction', () => {

  test('Should be valid (REGULAR default)', () => {
    const tx = new Transaction({
        data: 'tx 1'
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeTruthy();
  });

  test('Should NOT be valid (REGULAR with params)', () => {
    const tx = new Transaction({
        data: 'tx 1',
        type: TransactionType.REGULAR,
        timestamp: Date.now(),
        hash: 'abc'
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be valid (FEE)', () => {
    const tx = new Transaction({
        data: 'tx 1',
        type: TransactionType.FEE
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeTruthy();
  });


  test('Should be NOT valid (REGULAR) (invalid hash)', () => {
    const tx = new Transaction({
        data: 'tx 1'
    } as Transaction);

    tx.hash = 'abc';

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be NOT valid (FEE) (invalid hash)', () => {
    const tx = new Transaction({
        data: 'tx 1',
        type: TransactionType.FEE
    } as Transaction);

    tx.hash = 'abc';

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be NOT valid (REGULAR) (invalid data)', () => {
    const tx = new Transaction();

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });

  test('Should be NOT valid (FEE) (invalid data)', () => {
    const tx = new Transaction({
        data: '',
        type: TransactionType.FEE
    } as Transaction);

    const valid = tx.isValid();

    expect(valid.success).toBeFalsy();
  });
});