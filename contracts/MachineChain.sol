// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract MachineChain {
    address public owner;
    address public oracle;
    IERC20 public stablecoin;

    struct Policy {
        address plant;
        uint256 coverageAmount;
        uint256 expiry;
        bool active;
        uint256 lastClaim;
    }

    mapping(bytes32 => Policy) public policies;
    mapping(bytes32 => bool) public claimProcessed;

    uint256 public constant COOLDOWN = 24 hours;
    uint256 public constant MIN_CONFIDENCE = 85;

    event PolicyCreated(bytes32 indexed equipmentId, address plant, uint256 coverage);
    event ClaimTriggered(bytes32 indexed equipmentId, address plant, uint256 amount, uint256 timestamp);
    event ClaimDenied(bytes32 indexed equipmentId, string reason);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only AI oracle can trigger claims");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _stablecoin, address _oracle) {
        owner = msg.sender;
        stablecoin = IERC20(_stablecoin);
        oracle = _oracle;
    }

    function createPolicy(
        bytes32 equipmentId,
        address plant,
        uint256 coverageAmount,
        uint256 durationDays
    ) external {
        policies[equipmentId] = Policy({
            plant: plant,
            coverageAmount: coverageAmount,
            expiry: block.timestamp + (durationDays * 1 days),
            active: true,
            lastClaim: 0
        });

        emit PolicyCreated(equipmentId, plant, coverageAmount);
    }

    function triggerClaim(
        bytes32 equipmentId,
        bytes32 claimId,
        uint8 confidenceScore,
        string calldata failureType
    ) external onlyOracle {
        failureType;
        Policy storage policy = policies[equipmentId];

        if (!policy.active) {
            emit ClaimDenied(equipmentId, "Policy inactive");
            return;
        }
        if (block.timestamp > policy.expiry) {
            emit ClaimDenied(equipmentId, "Policy expired");
            return;
        }
        if (block.timestamp < policy.lastClaim + COOLDOWN) {
            emit ClaimDenied(equipmentId, "Cooldown active");
            return;
        }
        if (confidenceScore < MIN_CONFIDENCE) {
            emit ClaimDenied(equipmentId, "AI confidence below threshold");
            return;
        }
        if (claimProcessed[claimId]) {
            emit ClaimDenied(equipmentId, "Already processed");
            return;
        }

        claimProcessed[claimId] = true;
        policy.lastClaim = block.timestamp;

        bool success = stablecoin.transfer(policy.plant, policy.coverageAmount);
        require(success, "Transfer failed");

        emit ClaimTriggered(equipmentId, policy.plant, policy.coverageAmount, block.timestamp);
    }

    function fundPool(uint256 amount) external {
        stablecoin.transferFrom(msg.sender, address(this), amount);
    }

    function updateOracle(address newOracle) external onlyOwner {
        oracle = newOracle;
    }
}
