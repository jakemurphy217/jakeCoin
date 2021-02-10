const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingkey) {

        if (signingkey.getPublic('hex') !== this.fromAddress) {
            throw new Error('cant sign transactions for other wallets!!....');
        }

        const hashTx = this.calculateHash();
        const sig = signingkey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValdid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No Signature in this transaction!......');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

}


//a 'block' in the blockchain 
class Block {
    constructor(timestamp, transactions, previousHash = '') {

        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined: " + this.hash);
    }

    hasValidTransaction() {
        for (const tx of this.transactions) {
            if (!tx.isValdid()) {
                return false;
            }
        }
        return true;
    }

}

// the 'chain' in the blockchain  
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        // the amount of 0's infront of the hash - mining 
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    //first block in the blockchain - never changes index 0
    createGenesisBlock() {
        return new Block("01/01/2021", "Genesis Block", "0");
    }

    // gets latest block create for seeing previous hash before new block is created.
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {

        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("block successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [ ]
    }

    // pushing transaction to pendig array
    addTransaction(transaction) {


        if(!transaction.fromAddress || !transaction.toAddress){
            throw Error('transaction must include to and from address');

        }

        if(!transaction.isValdid()){
            throw Error('cannot add invaild transaction to the chain');
        }

        this.pendingTransactions.push(transaction);
    }

    // getting balance 
    getBalanceOfAddress(address) {
        //wallet balance
        let balance = 0

        // looping through blocks on chain
        for (const block of this.chain) {

            // looping through transactions wihin each block
            for (const trans of block.transactions) {

                // fromaddress = minus(-)
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                // toaddress = plus(+)
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }


    // checks if chain is valid
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previosBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransaction()){
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previosBlock.hash) {
                return false;
            }
        }
        // if nothing chain hasnt been tampered with
        return true;
    }

}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;