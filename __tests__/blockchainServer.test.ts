import request from 'supertest';
import { app } from "../src/server/blockchainServer";
import Blockchain from "../src/lib/blockchain";
import Block from "../src/lib/block";
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe('BlockchainServer', () => {

    test("GET /status - Should return status", async () => {
        const response = await request(app).get('/status');
        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
 
    });

    test("GET /block/next - Should get next block info", async () => {
        const response = await request(app).get('/block/next');
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(1);
    });

    test("GET /block/:index - Should return genesis", async () => {
        const response = await request(app).get('/block/0');
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    });

    test("GET /block/:hash - Should return genesis", async () => {
        const response = await request(app).get('/block/abc');
        expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual('abc');
    });

    test("GET /block/:indexOrHash - Should return 404", async () => {
        const response = await request(app).get('/block/1');
        expect(response.status).toEqual(404);
    });

    test("POST /block - Should return 201", async () => {
        const block = new Block({
            index: 1,
        } as Block);

        const response = await request(app)
            .post('/block')
            .send(block);

        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
    });

    test("POST /block - Should return 422", async () => {
        const response = await request(app)
            .post('/block')
            .send({});

        expect(response.status).toEqual(422);
    });

    test("POST /block - Should return 400", async () => {
        const block = new Block({
            index: -1,
        } as Block);

        const response = await request(app)
            .post('/block')
            .send(block);

        expect(response.status).toEqual(400);
    });

    
    test("GET /transactions/:hash - Should return transaction", async () => {
        const response = await request(app).get('/transactions/abc');
        expect(response.status).toEqual(200);
        expect(response.body.mempoolIndex).toEqual(0);
    });

    test("POST /transactions - Should return 201", async () => {
        const tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);

        const response = await request(app)
            .post('/transactions')
            .send(tx);

        expect(response.status).toEqual(201);
    });

    test("POST /transactions - Should return 422", async () => {
        let tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);

        tx.hash = '';

        const response = await request(app)
            .post('/transactions')
            .send(tx);

        expect(response.status).toEqual(422);
    });
});