import express from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';

const PORT = 3000;

const app = express();

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

if(process.argv.includes('--run')) {
    app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`);});
}

export {
    app
}