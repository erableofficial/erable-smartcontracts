// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop  {
    IERC20 public token;

    struct AirdropCycle {
        bytes32 merkleRoot;
        bool isActive;
    }
    address _owner;

    AirdropCycle[] public airdropCycles;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    event AirdropCycleCreated(uint256 cycleIndex, bytes32 merkleRoot);
    event TokensClaimed(address indexed claimant, uint256 amount);
    event TokensDeposited(uint256 amount);
    constructor(IERC20 _token) {
        token = _token;
        _owner = msg.sender;
    }
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    function createAirdropCycle(bytes32 _merkleRoot) external onlyOwner {
        airdropCycles.push(AirdropCycle({
            merkleRoot: _merkleRoot,
            isActive: true
        }));
        emit AirdropCycleCreated(airdropCycles.length - 1, _merkleRoot);
    }

    function claimTokens(uint256 cycleIndex, uint256 amount, bytes32[] calldata proof) external {
        require(cycleIndex < airdropCycles.length, "Invalid cycle index");
        require(!hasClaimed[cycleIndex][msg.sender], "Airdrop already claimed in this cycle");
        require(airdropCycles[cycleIndex].isActive, "Airdrop cycle is not active");
        
        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, airdropCycles[cycleIndex].merkleRoot, leaf), "Invalid merkle proof");

        // Mark as claimed
        hasClaimed[cycleIndex][msg.sender] = true;

        // Transfer the tokens
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        emit TokensClaimed(msg.sender, amount);
    }

    function depositTokens(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        emit TokensDeposited(amount);
    }

    function checkClaimable(uint256 cycleIndex, address wallet, uint256 amount, bytes32[] calldata proof) external view returns (bool) {
        require(cycleIndex < airdropCycles.length, "Invalid cycle index");
        require(airdropCycles[cycleIndex].isActive, "Airdrop cycle is not active");

        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(wallet, amount));
        bool isValidProof = MerkleProof.verify(proof, airdropCycles[cycleIndex].merkleRoot, leaf);
        return isValidProof && !hasClaimed[cycleIndex][wallet];
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.transfer(msg.sender, amount), "Token transfer failed");
    }
}
