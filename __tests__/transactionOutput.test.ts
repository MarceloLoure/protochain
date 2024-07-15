import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';


describe('Transaction Output', () => {

    let alice: Wallet;
    let bob: Wallet;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    });

    test('Should be valid', () => {
        const txInput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: 'abc'
        } as TransactionOutput);

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();
        
    });

    test('Should NOT be valid (Amount)', () => {
        const txInput = new TransactionOutput({
            amount: -1,
            toAddress: alice.publicKey,
            tx: 'abc'
        } as TransactionOutput);

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
        
    });

});