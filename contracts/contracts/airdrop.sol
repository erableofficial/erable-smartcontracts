// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title MerkleAirdrop
 * @dev A contract for distributing ERC20 tokens via Merkle tree airdrops.
 */
contract MerkleAirdrop is Ownable(msg.sender) {
    using SafeERC20 for IERC20;

    /// @notice The ERC20 token to be airdropped
contract MerkleAirdrop  {
    IERC20 public token;

    /// @notice Represents an airdrop cycle
    struct AirdropCycle {
        bytes32 merkleRoot;
        bool isActive;
    }
    address _owner;

    /// @notice List of airdrop cycles
    AirdropCycle[] public airdropCycles;

    /// @notice Tracks whether an address has claimed tokens in a specific cycle
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    event AirdropCycleCreated(uint256 cycleIndex, bytes32 merkleRoot);
    event TokensClaimed(address indexed claimant, uint256 amount);
    event TokensDeposited(uint256 amount);
    event LogLeaf(bytes32 leaf);
    event LogMerkleRoot(bytes32 root);
    event AirdropCycleDisabled(uint256 cycleIndex);

    // Custom errors
    error InvalidCycleIndex();
    error AirdropAlreadyClaimed();
    error AirdropNotActive();
    error InvalidMerkleProof();
    error TokenTransferFailed();
    error CannotDepositZero();

    /**
     * @dev Sets the token to be airdropped.
     * @param _token The ERC20 token address.
     */
    constructor(IERC20 _token) {
        token = _token;
        _owner = msg.sender;
    }
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /**
     * @notice Create a new airdrop cycle
     * @param _merkleRoot The Merkle root of the airdrop data
     */
    function createAirdropCycle(bytes32 _merkleRoot) external onlyOwner {
        airdropCycles.push(
            AirdropCycle({merkleRoot: _merkleRoot, isActive: true})
        );
        emit AirdropCycleCreated(airdropCycles.length - 1, _merkleRoot);
    }

    /**
     * @notice Disable an airdrop cycle
     * @param cycleIndex The index of the airdrop cycle to disable
     */
    function disableAirdropCycle(uint256 cycleIndex) external onlyOwner {
        if (cycleIndex >= airdropCycles.length) {
            revert InvalidCycleIndex();
        }
        airdropCycles[cycleIndex].isActive = false;
        emit AirdropCycleDisabled(cycleIndex);
    }

    /**
     * @notice Claim tokens in a specific airdrop cycle
     * @param cycleIndex The index of the airdrop cycle
     * @param amount The amount of tokens to claim
     * @param proof The Merkle proof
     */
    function claimTokens(
        uint256 cycleIndex,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        if (cycleIndex >= airdropCycles.length) {
            revert InvalidCycleIndex();
        }
        if (hasClaimed[cycleIndex][msg.sender]) {
            revert AirdropAlreadyClaimed();
        }
        if (!airdropCycles[cycleIndex].isActive) {
            revert AirdropNotActive();
        }

        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        emit LogLeaf(leaf);
        emit LogMerkleRoot(airdropCycles[cycleIndex].merkleRoot);
        if (
            !MerkleProof.verify(
                proof,
                airdropCycles[cycleIndex].merkleRoot,
                leaf
            )
        ) {
            revert InvalidMerkleProof();
        }

        // Mark as claimed
        hasClaimed[cycleIndex][msg.sender] = true;

        // Transfer the tokens
        token.safeTransfer(msg.sender, amount);
        emit TokensClaimed(msg.sender, amount);
    }

    /**
     * @notice Deposit tokens to the contract
     * @param amount The amount of tokens to deposit
     */
    function depositTokens(uint256 amount) external onlyOwner {
        if (amount == 0) {
            revert CannotDepositZero();
        }
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit TokensDeposited(amount);
    }

    /**
     * @notice Check if an address can claim tokens
     * @param cycleIndex The index of the airdrop cycle
     * @param wallet The address to check
     * @param amount The amount of tokens to check
     * @param proof The Merkle proof
     * @return bool True if the address can claim tokens, otherwise false
     */
    function checkClaimable(
        uint256 cycleIndex,
        address wallet,
        uint256 amount,
        bytes32[] calldata proof
    ) external view returns (bool) {
        if (cycleIndex >= airdropCycles.length) {
            revert InvalidCycleIndex();
        }
        if (!airdropCycles[cycleIndex].isActive) {
            revert AirdropNotActive();
        }

        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(wallet, amount));
        bool isValidProof = MerkleProof.verify(
            proof,
            airdropCycles[cycleIndex].merkleRoot,
            leaf
        );
        return isValidProof && !hasClaimed[cycleIndex][wallet];
    }

    /**
     * @notice Withdraw tokens from the contract
     * @param amount The amount of tokens to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        token.safeTransfer(msg.sender, amount);
    }

    /**
     * @notice Check if a user has claimed in a specific cycle
     * @param cycleIndex The index of the airdrop cycle
     * @param user The address of the user
     * @return bool True if the user has claimed, otherwise false
     */
    function hasUserClaimed(
        uint256 cycleIndex,
        address user
    ) external view returns (bool) {
        return hasClaimed[cycleIndex][user];
    }

    /**
     * @notice Get the number of airdrop cycles
     * @return uint256 The number of airdrop cycles
     */
    function getAirdropCycleCount() external view returns (uint256) {
        return airdropCycles.length;
    }

    /**
     * @notice Get the airdrop cycle data
     * @param cycleIndex The index of the airdrop cycle
     * @return bytes32 The Merkle root of the airdrop cycle
     * @return bool True if the airdrop cycle is active, otherwise false
     */

    function getAirdropCycle(
        uint256 cycleIndex
    ) external view returns (bytes32, bool) {
        if (cycleIndex >= airdropCycles.length) {
            revert InvalidCycleIndex();
        }
        return (
            airdropCycles[cycleIndex].merkleRoot,
            airdropCycles[cycleIndex].isActive
        );
    }

    /**
     * @notice Get all the airdrop cycles
     * @return  AirdropCycle[] The list of airdrop cycles
     */
    function getAllAirdropCycles()
        external
        view
        returns (AirdropCycle[] memory)
    {
        return airdropCycles;
    }
}
