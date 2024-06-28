import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';
import Transaction from '../lib/transaction';

const PORT = parseInt(`${process.env.PORT}`) || 3000;

const app = express();

/* c8 ignore next */
if(process.argv.includes('--run')) {app.use(morgan('tiny'));}

app.use(express.json());

const blockchain = new Blockchain();

app.get('/status', (req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLatestBlock()
    });
});

app.get('/block/next', (req, res, next) => {
    res.json(blockchain.getNextBlock());
});

app.get('/block/:indexOrHash', (req, res, next) => {
    let block;
    if(/^[0-9]+$/.test(req.params.indexOrHash)){
        block = blockchain.blocks[parseInt(req.params.indexOrHash)];
    } else {
        block = res.json(blockchain.getBlock(req.params.indexOrHash));
    }

    if(!block) {
        res.sendStatus(404);
    } else {
        res.json(block);
    }

});

app.get('/transactions', (req, res, next) => {
    res.json({
        next: blockchain.mempool.slice(0,10),
        total: blockchain.mempool.length
    });
});

app.get('/transactions/:hash?', (req, res, next) => {

    if(req.params.hash) {
        const tx = blockchain.getTransaction(req.params.hash);
        if(tx) {
            res.json(tx);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.json({
            next: blockchain.mempool.slice(0,10),
            total: blockchain.mempool.length
        });
    }

    res.json({
        next: blockchain.mempool.slice(0,10),
        total: blockchain.mempool.length
    });
});

app.post('/block', (req, res, next) => {
    if(req.body.hash === undefined ) {
        return res.sendStatus(422);
    }

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if(validation.success) {
        res.status(201).json(block);
    } else {
        res.status(400).json(validation);
    }
});

app.post('/transactions', (req, res, next) => {
    if(req.body.hash === undefined || req.body.hash === '') {
        return res.sendStatus(422);
    }

    const tx = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(tx);

    if(validation.success) {
        res.status(201).json(tx);
    } else {
        res.status(400).json(validation);
    }
});

/* c8 ignore next */
if(process.argv.includes('--run')) {app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`);});}

export {
    app
}