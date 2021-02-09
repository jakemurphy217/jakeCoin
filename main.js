const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("block successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // pushing transaction to pendig array
    createTransaction(transaction) {
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

//initating the jakeCoin Blockchain
let jakeCoin = new Blockchain();

jakeCoin.createTransaction(new Transaction('address1', 'address2', 100));
jakeCoin.createTransaction(new Transaction('address2', 'address1', 300));

console.log('\n Starting the miner.....');
jakeCoin.minePendingTransactions('jakes-address');

console.log('\n balance of jakes is: ' + jakeCoin.getBalanceOfAddress('jakes-address'));

console.log('\n Starting the miner again.....');
jakeCoin.minePendingTransactions('jakes-address');

console.log('\n balance of jakes is: ' + jakeCoin.getBalanceOfAddress('jakes-address'));
