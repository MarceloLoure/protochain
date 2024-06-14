import request from 'supertest';
import { app } from "../src/server/blockchainServer";
import Blockchain from "../src/lib/blockchain";
import Block from "../src/lib/block";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

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

});