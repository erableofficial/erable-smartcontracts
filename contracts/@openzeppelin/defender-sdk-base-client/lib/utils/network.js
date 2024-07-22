"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toChainId = exports.fromChainId = exports.isValidNetwork = exports.Networks = void 0;
const lodash_1 = require("lodash");
exports.Networks = [
    'mainnet',
    'sepolia',
    'holesky',
    'xdai',
    'sokol',
    'fuse',
    'bsc',
    'bsctest',
    'fantom',
    'fantomtest',
    'moonbase',
    'moonriver',
    'moonbeam',
    'matic',
    'mumbai',
    'amoy',
    'matic-zkevm',
    'matic-zkevm-testnet',
    'avalanche',
    'fuji',
    'arbitrum',
    'arbitrum-nova',
    'arbitrum-sepolia',
    'optimism',
    'optimism-sepolia',
    'celo',
    'alfajores',
    'harmony-s0',
    'harmony-test-s0',
    'aurora',
    'auroratest',
    'hedera',
    'hederatest',
    'zksync',
    'zksync-sepolia',
    'base',
    'base-sepolia',
    'linea-goerli',
    'linea',
    'x-dfk-avax-chain',
    'x-dfk-avax-chain-test',
    'x-security-alliance',
    'mantle',
    'mantle-sepolia',
    'scroll',
    'scroll-sepolia',
    'meld',
    'meld-kanazawa',
];
function isValidNetwork(text) {
    return exports.Networks.includes(text);
}
exports.isValidNetwork = isValidNetwork;
function fromChainId(chainId) {
    return (0, lodash_1.findKey)(chainIds, (number) => number === chainId);
}
exports.fromChainId = fromChainId;
function toChainId(network) {
    return chainIds[network];
}
exports.toChainId = toChainId;
const chainIds = {
    'mainnet': 1,
    'sepolia': 11155111,
    'holesky': 17000,
    'xdai': 100,
    'sokol': 77,
    'fuse': 122,
    'bsc': 56,
    'bsctest': 97,
    'fantom': 250,
    'fantomtest': 0xfa2,
    'moonbase': 1287,
    'moonriver': 1285,
    'moonbeam': 1284,
    'matic': 137,
    'mumbai': 80001,
    'amoy': 80002,
    'matic-zkevm': 1101,
    'matic-zkevm-testnet': 1442,
    'avalanche': 0xa86a,
    'fuji': 0xa869,
    'optimism': 10,
    'optimism-sepolia': 11155420,
    'arbitrum': 42161,
    'arbitrum-nova': 42170,
    'arbitrum-sepolia': 421614,
    'celo': 42220,
    'alfajores': 44787,
    'harmony-s0': 1666600000,
    'harmony-test-s0': 1666700000,
    'aurora': 1313161554,
    'auroratest': 1313161555,
    'hedera': 295,
    'hederatest': 296,
    'zksync': 324,
    'zksync-sepolia': 300,
    'base': 8453,
    'base-sepolia': 84532,
    'linea': 59144,
    'linea-goerli': 59140,
    'x-dfk-avax-chain': 53935,
    'x-dfk-avax-chain-test': 335,
    'x-security-alliance': 888,
    'mantle': 5000,
    'scroll': 534352,
    'scroll-sepolia': 534351,
    'meld': 0x13d92e8d,
    'meld-kanazawa': 0xd3b745e,
    'mantle-sepolia': 5003,
};
