import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import BlockInfo from "../lib/blockInfo";
import Block from "../lib/block";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;;
const minerWallet = {
    privateKey: '123456',
    publicKey: `${process.env.MINER_WALLET}`
}

let totalMined = 0;

async function mine() {
    console.log("Getting next block info...")

    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}block/next`);

    if(!data) {
        console.log('No block to mine...');
        return setTimeout(() => {
            mine();
        }, 5000);
    }

    const blockInfo = data as BlockInfo;

    const newBlock = Block.fromBlockInfo(blockInfo);

    // Para fazer: Adicionar tx de recompensa

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