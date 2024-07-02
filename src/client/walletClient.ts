import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import Wallet from "../lib/wallet";
import readline from "readline";
import Transaction from "../lib/transaction";
import TransactionType from "../lib/transactionType";
import TransactionInput from "../lib/transactionInput";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

let myWalletPub = "";
let myWalletPriv = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    setTimeout(() => {
        console.clear();

        if(myWalletPub){
            console.log(` Você está logado com a carteira ${myWalletPub}`);
        } else {
            console.log(" Você não está logado");
        }

        console.log("1 - Criar carteira");
        console.log("2 - Recuperar carteira");
        console.log("3 - Verificar saldo");
        console.log("4 - Enviar tx");
        console.log("5 - Consultar txs");
        console.log("6 - Deslogar");
        rl.question("Escolha uma opção: ", (answer) => {
            switch (answer) {
                case "1":
                    createWallet();
                    break;
                case "2":
                    recoverWallet();
                    break;
                case "3":
                    checkBalance();
                    break;
                case "4":
                    sendTx();
                    break;
                case "5":
                    searchTx();
                    break;
                case "6":
                    logout();
                    break;
                default:
                    console.log("Opção inválida");
                    menu();
                    break;
            }
        });

    }, 1000);
}

function preMenu() {
    rl.question("Pressione enter para continuar", () => {
        menu();
    });
}


function createWallet () {
    console.clear();
    const wallet = new Wallet();
    console.log(`Sua carteira foi criada com sucesso!`);
    console.log(`Salve suas chaves privadas em um local seguro:`);
    console.log(wallet);

    myWalletPriv = wallet.privateKey;
    myWalletPub = wallet.publicKey;
    preMenu();
}

function recoverWallet() {
    console.clear();
    rl.question("Digite sua chave privada: ", (answer) => {
        const wallet = new Wallet(answer);
        console.log(`Sua carteira foi recuperada com sucesso!`);
        console.log(`Salve suas chaves privadas em um local seguro:`);
        console.log(wallet);

        myWalletPriv = wallet.privateKey;
        myWalletPub = wallet.publicKey;
        preMenu();
    });
}

function checkBalance() {
    console.clear();
    
    if(!myWalletPub){
        console.log("Você precisa estar logado para verificar o saldo");
        preMenu();
        return;
    }
    console.log('Em desenvolvimento...')

    preMenu();
}

function sendTx() {
    console.clear();
    if(!myWalletPub){
        console.log("Você precisa estar logado para enviar uma transação");
        preMenu();
        return;
    }

    console.log(`Sua carteira: ${myWalletPub}`);

    rl.question("Digite o endereço de destino: ", (toAddress) => {
        if(toAddress.length !== 66){
            console.log("Endereço inválido");
            preMenu();
            return;
        }

        rl.question("Digite o valor da transação: ", async (amountStr) => {
            const amount = parseInt(amountStr);
            if(!amount){
                console.log("Valor inválido");
                preMenu();
                return;
            }

            //balance validation
            const tx = new Transaction();
            tx.timestamp = Date.now();
            tx.to = toAddress;
            tx.type = TransactionType.REGULAR;
            tx.txInput = new TransactionInput({
                amount,
                fromAddress: myWalletPub
            } as TransactionInput);

            tx.txInput.sign(myWalletPriv);
            tx.hash = tx.getHash();

            try {
                const txResponse = await axios.post(`${BLOCKCHAIN_SERVER}transactions`, tx);
                console.log("Transação enviada com sucesso! Aguardando minerador");
                console.log(txResponse.data.hash);
                preMenu();
            } catch (error: any) {
                console.error(error.response ? error.response.data : error.message);
                preMenu();
            }
        });
    });
    preMenu();
}

function searchTx() {
    console.clear();
    rl.question("Digite o hash da transação: ", async (hash) => {
        try {
            const txResponse = await axios.get(`${BLOCKCHAIN_SERVER}transactions/${hash}`);
            console.log(txResponse.data);
            preMenu();
        } catch (error: any) {
            console.error(error.response ? error.response.data : error.message);
            preMenu();
        }
    });
}

function logout() {
    myWalletPriv = "";
    myWalletPub = "";
    console.log("Você foi deslogado com sucesso!");
    preMenu();
}

menu();