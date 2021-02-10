const {Blockchain} = require('./blockchain');
const {Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('78a559f5d63d5f9ded21b30bb20be3eefa3f45b6f5d3d044da741dd8077500e2');
const myWalletAddress = myKey.getPublic('hex');

//initating the jakeCoin Blockchain
let jakeCoin = new Blockchain();

const tx1 = new Transaction( myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
jakeCoin.addTransaction(tx1);

console.log('\n Starting the miner.....');
jakeCoin.minePendingTransactions(myWalletAddress);

console.log('\n balance of jakes is: ' + jakeCoin.getBalanceOfAddress(myWalletAddress));

// // trying to change to manipulate the first transaction[0] on the first block[1] - method detects
// // invalid
// jakeCoin.chain[1].transactions[0].amount = 1;

console.log('is chain valid: '+ jakeCoin.isChainValid());