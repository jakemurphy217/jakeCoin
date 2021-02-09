const SHA256 = require('crypto-js/sha256');

//a 'block' in the blockchain 
class Block {
    constructor(index, timestamp, data, previousHash = '') {

        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// the 'chain' in the blockchain  
class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    //first block in the blockchain - never changes index 0
    createGenesisBlock(){
        return new Block(0, "01/01/2021", "Genesis Block", "0");
    }

    // gets latest block create for seeing previous hash before new block is created.
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // generates new block for the chain
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previosBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previosBlock.hash){
                return false;
            }
        }
        return true;
    }

}

let jakeCoin = new Blockchain();

jakeCoin.addBlock(new Block(1, "01/02/2021", {amount: 4 } ));
jakeCoin.addBlock(new Block(1, "09/02/2021", {amount: 100 } ));

console.log("Is the blockchain valid? " + jakeCoin.isChainValid());

jakeCoin.chain[1].data = {amount: 100000000};
jakeCoin.chain[1].hash = jakeCoin.chain[1].calculateHash();

console.log("Is the blockchain valid after change? " + jakeCoin.isChainValid());

// console.log(JSON.stringify(jakeCoin, null, 4));