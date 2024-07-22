const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const ethers = require('ethers');

const elements = [
    { address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', amount: 10 },
    { address: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', amount: 20 }
];

const leaves = elements.map(e => keccak256(ethers.solidityPacked(['address', 'uint256'], [e.address, e.amount])));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();
const proof = tree.getHexProof(leaves[0]);

console.log('Merkle Root:', root);
console.log('Proof:', proof);
console.log(leaves[0])