const SHA256 = require('crypto-js/sha256');

//a 'block' in the blockchain 
class Block {
    constructor(index, timestamp, data, previousHash = '') {

        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined: " + this.hash);
    }
}

// the 'chain' in the blockchain  
class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        // the amount of 0's infront of the hash - mining 
        this.difficulty = 5;
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
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

// checks if chain is valid
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
        // if nothing chain hasnt been tampered with
        return true;
    }

}

//initating the jakeCoing Blockchain
let jakeCoin = new Blockchain();

console.log('Mining block 1........');
jakeCoin.addBlock(new Block(1, "01/02/2021", {amount: 4 } ));

console.log('Mining block 1........');
jakeCoin.addBlock(new Block(2, "09/02/2021", {amount: 100 } ));

// //printing the jakecoin blocks in the terminal
// console.log(JSON.stringify(jakeCoin, null, 4));

// //checks if chain is valid
// console.log("Is the blockchain valid? " + jakeCoin.isChainValid());

// //changing the values on block to see if changes are detected 
// jakeCoin.chain[1].data = {amount: 100000000};
// jakeCoin.chain[1].hash = jakeCoin.chain[1].calculateHash();

// //checking if blockchain is valid again
// console.log("Is the blockchain valid after change? " + jakeCoin.isChainValid());

