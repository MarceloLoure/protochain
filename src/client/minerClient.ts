import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import BlockInfo from "../lib/blockInfo";
import Block from "../lib/block";
import Wallet from '../lib/wallet';
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET);

console.log(`Miner logged with wallet ${minerWallet.publicKey}`)

let totalMined = 0;

async function mine() {
    console.log("Getting next block info...")

    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}block/next`);

    if(!data) {
        console.log("No tx found. Waiting...");
        return setTimeout(() => {
            mine();
        }, 5000);
    }

    const blockInfo = data as BlockInfo;

    const newBlock = Block.fromBlockInfo(blockInfo);

    newBlock.transactions.push(new Transaction({
        to: minerWallet.publicKey,
        type: TransactionType.FEE,
    } as Transaction))

    newBlock.miner = minerWallet.publicKey;

    newBlock.hash = newBlock.getHash();

    console.log('Start mining block #'+blockInfo.index+'...');

    newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

    console.log('Block mined! Send to blockchain...');

    try {
        await axios.post(`${BLOCKCHAIN_SERVER}block`, newBlock);
        console.log('Block added to blockchain!');
        totalMined++;
        console.log('Total mined blocks: '+totalMined);
    } catch (err: any) {
        console.log(err.response ? err.response.data : err.message);
        return;
    }

    setTimeout(() => mine(), 1000);
}

mine();