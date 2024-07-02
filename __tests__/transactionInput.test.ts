import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet';


describe('Transaction Input', () => {

    let alice: Wallet;
    let bob: Wallet;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    });

    test('Should be valid', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput);

        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toEqual(true);
        
    });

    test('Should NOT be valid', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput);

        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toEqual(true);
        
    });

    test('Should NOT be valid (NOT SIGNATURE)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput);

        const valid = txInput.isValid();
        expect(valid.success).toEqual(false);
        
    });

    test('Should NOT be valid (AMOUNT UNDER 0)', () => {
        const txInput = new TransactionInput({
            amount: -10,
            fromAddress: alice.publicKey,
        } as TransactionInput);

        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toEqual(false);
        
    });

    test('Should NOT be valid (INVALID SIGNATURE)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput);

        txInput.sign(bob.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toEqual(false);
        
    });

    test('Should NOT be valid (DEFAULT', () => {
        const txInput = new TransactionInput();

        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();
        expect(valid.success).toEqual(false);
        
    });

});