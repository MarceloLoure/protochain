import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import BlockInfo from "../lib/blockInfo";
import Block from "../lib/block";
import Wallet from '../lib/wallet';
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionOutput from '../lib/transactionOutput';
import Blockchain from '../lib/blockchain';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET);

console.log(`Miner logged with wallet ${minerWallet.publicKey}`)

let totalMined = 0;

function getRewardTx(blockInfo: BlockInfo, nextBlock: Block): Transaction | undefined {
    let amount = 0;

    if(blockInfo.difficulty <= blockInfo.maxDifficulty) {
        amount += Blockchain.getRewardAmount(blockInfo.difficulty);
    }

    const fees = nextBlock.transactions.map(tx => tx.getFee()).reduce((a, b) => a + b);
    const feeCheck = nextBlock.transactions.length * blockInfo.feePerTx;

    if(fees < feeCheck) {
        console.log('Low fees. Awainting for next block...')
        setTimeout(() => mine(), 5000);
        return;
    }

    amount += fees;

    const txo = new TransactionOutput({
        toAddress: minerWallet.publicKey,
        amount,
    } as TransactionOutput);

    const tx = Transaction.fromReward(txo)

    return tx;
}

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

    const tx = getRewardTx(blockInfo, newBlock)

    if(!tx) return;

    newBlock.transactions.push(tx);

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