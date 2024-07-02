import Wallet from '../src/lib/wallet';


describe('Wallet', () => {

    let alice: Wallet;
    const exampleWIF = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'

    beforeAll(() => {
        alice = new Wallet();
    });

    test('Should gerenate wallet', () => {
        const wallet = new Wallet();

        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    });

    test('Should recovery wallet (PK)', () => {
        const wallet = new Wallet(alice.privateKey);

        expect(wallet.publicKey).toEqual(alice.publicKey);
    });

    test('Should recovery wallet (WIF)', () => {
        const wallet = new Wallet(exampleWIF);

        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    });


});