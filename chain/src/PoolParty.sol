// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PoolParty is VRFConsumerBaseV2, ReentrancyGuard {
    // Config
    address public admin;
    IERC20 public immutable usdc;
    address public aavePool; // For MVP: simulate yield off-chain or hardcoded yield

    // Round state
    uint256 public currentRound;
    uint256 public roundStart;
    uint256 public constant ENTRY_AMOUNT = 100e6; // 100 USDC
    uint256 public constant ROUND_DURATION = 7 days;
    uint256 public constant WINNER_PERCENTAGE = 10;

    mapping(uint256 => address[]) public roundParticipants;
    mapping(uint256 => mapping(address => bool)) public hasEntered;
    mapping(uint256 => address[]) public roundWinners;
    mapping(address => uint256) public pendingPrizes;

    // Chainlink VRF
    VRFCoordinatorV2Interface public coordinator;
    uint64 public subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 200_000;
    uint16 public constant requestConfirmations = 3;
    uint32 public constant numWords = 1;

    mapping(uint256 => uint256) public vrfRequestToRound;

    constructor(
        address _usdc,
        address _vrfCoordinator,
        uint64 _subId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        admin = msg.sender;
        usdc = IERC20(_usdc);
        coordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subId;
        keyHash = _keyHash;
        roundStart = block.timestamp;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function enter() external nonReentrant {
        require(block.timestamp < roundStart + ROUND_DURATION, "Round closed");
        require(!hasEntered[currentRound][msg.sender], "Already entered");

        usdc.transferFrom(msg.sender, address(this), ENTRY_AMOUNT);

        roundParticipants[currentRound].push(msg.sender);
        hasEntered[currentRound][msg.sender] = true;
    }

    function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = block.timestamp >= roundStart + ROUND_DURATION;
    }

    function performUpkeep(bytes calldata) external {
        require(block.timestamp >= roundStart + ROUND_DURATION, "Too early");
        uint256 requestId = coordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        vrfRequestToRound[requestId] = currentRound;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 roundId = vrfRequestToRound[requestId];
        address[] storage participants = roundParticipants[roundId];
        uint256 winnerCount = participants.length / 10;
        if (winnerCount == 0 && participants.length > 0) winnerCount = 1;

        // Shuffle and pick first N
        for (uint256 i = 0; i < winnerCount; i++) {
            uint256 randIdx = uint256(keccak256(abi.encode(randomWords[0], i))) % participants.length;
            address winner = participants[randIdx];
            roundWinners[roundId].push(winner);
        }

        // Yield simulation: 5% gain
        uint256 totalYield = (ENTRY_AMOUNT * participants.length * 5) / 100;
        uint256 prizePerWinner = totalYield / roundWinners[roundId].length;
        for (uint256 i = 0; i < roundWinners[roundId].length; i++) {
            pendingPrizes[roundWinners[roundId][i]] += prizePerWinner;
        }

        // Start new round
        currentRound++;
        roundStart = block.timestamp;
    }

    function claimPrize() external nonReentrant {
        uint256 amount = pendingPrizes[msg.sender];
        require(amount > 0, "Nothing to claim");
        pendingPrizes[msg.sender] = 0;
        usdc.transfer(msg.sender, amount);
    }

    function withdrawEntry() external nonReentrant {
        require(block.timestamp >= roundStart + ROUND_DURATION, "Round not ended");
        require(hasEntered[currentRound][msg.sender], "No entry");
        require(pendingPrizes[msg.sender] == 0, "Winners cannot withdraw");

        hasEntered[currentRound][msg.sender] = false;
        usdc.transfer(msg.sender, ENTRY_AMOUNT);
    }
}
