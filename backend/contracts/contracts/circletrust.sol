// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CircleTrust {
    struct Pool {
        address creator;
        uint contributionAmount;
        uint maxMembers;
        uint currentRound;
        bool completed;
        bool exists;
        uint minimumReputation;
        uint creatorFeePercent; // fixed at 3
        uint roundDuration;    // seconds per round
        uint roundDeadline;    // timestamp: current round expires at
        address[] members;
        mapping(address => bool) hasJoined;
        mapping(address => bool) activeMember;
        mapping(address => uint) collateralDeposited;
    }

    uint public poolCount;
    mapping(uint => Pool) public pools;
    mapping(address => int256) public reputation;

    event PoolCreated(uint indexed poolId, address creator);
    event Joined(uint indexed poolId, address member);
    event Distributed(uint indexed poolId, address receiver);
    event CollateralSlashed(uint indexed poolId, address defaulter);
    event PoolCompleted(uint indexed poolId);

    modifier validPool(uint _poolId) {
        require(pools[_poolId].exists, "Pool does not exist");
        _;
    }

    // Create a new pool with custom settings
    function createPool(
        uint _contributionAmount,
        uint _maxMembers,
        uint _minimumReputation,
        uint _roundDuration
    ) external returns (uint poolId) {
        require(_contributionAmount > 0, "Contribution must be > 0");
        require(_maxMembers >= 2, "Need at least 2 members");
        require(_roundDuration >= 60, "Round duration must be >= 60 seconds");

        poolId = poolCount++;
        Pool storage pool = pools[poolId];
        pool.creator = msg.sender;
        pool.contributionAmount = _contributionAmount;
        pool.maxMembers = _maxMembers;
        pool.currentRound = 0;
        pool.completed = false;
        pool.exists = true;
        pool.minimumReputation = _minimumReputation;
        pool.creatorFeePercent = 3;
        pool.roundDuration = _roundDuration;

        emit PoolCreated(poolId, msg.sender);
    }

    // Join a specific pool (sends 2x contribution: 1x contribution + 1x collateral)
    function joinPool(uint _poolId) external payable validPool(_poolId) {
        Pool storage pool = pools[_poolId];
        require(!pool.completed, "Pool is completed");
        require(pool.members.length < pool.maxMembers, "Pool is full");
        require(
            reputation[msg.sender] >= int256(pool.minimumReputation),
            "Reputation too low"
        );
        require(!pool.hasJoined[msg.sender], "Already joined this pool");
        require(
            msg.value == pool.contributionAmount * 2,
            "Must send 2x contribution (contribution + collateral)"
        );

        pool.members.push(msg.sender);
        pool.hasJoined[msg.sender] = true;
        pool.activeMember[msg.sender] = true;
        pool.collateralDeposited[msg.sender] = pool.contributionAmount;

        emit Joined(_poolId, msg.sender);
    }

    // Distribute to the next member in rotation (time-based: auto-default if deadline passed)
    function distribute(uint _poolId) external validPool(_poolId) {
        Pool storage pool = pools[_poolId];
        require(pool.members.length == pool.maxMembers, "Pool is not full yet");
        require(!pool.completed, "Pool already completed");
        require(pool.currentRound < pool.maxMembers, "All rounds completed");

        address receiver = pool.members[pool.currentRound];

        // Set deadline on very first round trigger
        if (pool.roundDeadline == 0) {
            pool.roundDeadline = block.timestamp + pool.roundDuration;
        }

        if (block.timestamp <= pool.roundDeadline) {
            // ── Happy path: deadline not passed, pay the receiver ──
            reputation[receiver] += 1;

            uint feePerRound = (pool.contributionAmount * pool.creatorFeePercent) / 100;
            uint payout = pool.contributionAmount - feePerRound;
            (bool success, ) = receiver.call{value: payout}("");
            require(success, "Transfer failed");

            emit Distributed(_poolId, receiver);
        } else {
            // ── Default path: deadline passed, slash receiver's collateral ──
            uint slashedAmount = pool.collateralDeposited[receiver];
            pool.collateralDeposited[receiver] = 0;
            pool.activeMember[receiver] = false;
            reputation[receiver] -= 2;

            // Count remaining active members (excluding the defaulter)
            uint activeCount = 0;
            for (uint i = 0; i < pool.members.length; i++) {
                if (pool.activeMember[pool.members[i]]) {
                    activeCount++;
                }
            }

            // Redistribute slashed collateral equally among remaining active members
            if (activeCount > 0 && slashedAmount > 0) {
                uint share = slashedAmount / activeCount;
                for (uint i = 0; i < pool.members.length; i++) {
                    address member = pool.members[i];
                    if (pool.activeMember[member]) {
                        (bool ok_, ) = member.call{value: share}("");
                        require(ok_, "Slash distribution failed");
                    }
                }
            }

            emit CollateralSlashed(_poolId, receiver);
        }

        // Advance round and reset deadline
        pool.currentRound++;
        pool.roundDeadline = block.timestamp + pool.roundDuration;

        // Final round — pay creator fee, return collateral, mark completed
        if (pool.currentRound == pool.maxMembers) {
            _finalize(_poolId);
        }
    }

    // Internal: finalize pool after last round
    function _finalize(uint _poolId) internal {
        Pool storage pool = pools[_poolId];
        pool.completed = true;

        // Creator fee: 3% of total pool value
        uint totalPoolValue = pool.contributionAmount * pool.maxMembers;
        uint creatorFee = (totalPoolValue * pool.creatorFeePercent) / 100;
        if (creatorFee > 0) {
            (bool feeSuccess, ) = pool.creator.call{value: creatorFee}("");
            require(feeSuccess, "Creator fee transfer failed");
        }

        // Return collateral to all active members
        for (uint i = 0; i < pool.members.length; i++) {
            address member = pool.members[i];
            uint collateral = pool.collateralDeposited[member];
            if (pool.activeMember[member] && collateral > 0) {
                pool.collateralDeposited[member] = 0;
                (bool refundSuccess, ) = member.call{value: collateral}("");
                require(refundSuccess, "Collateral refund failed");
            }
        }

        emit PoolCompleted(_poolId);
    }

    // ── View Functions ────────────────────────────────────────

    function getPool(uint _poolId) external view validPool(_poolId) returns (
        address creator,
        uint contributionAmount,
        uint maxMembers,
        uint currentRound,
        uint memberCount,
        bool completed,
        uint minimumReputation,
        uint creatorFeePercent,
        uint roundDuration,
        uint roundDeadline
    ) {
        Pool storage pool = pools[_poolId];
        return (
            pool.creator,
            pool.contributionAmount,
            pool.maxMembers,
            pool.currentRound,
            pool.members.length,
            pool.completed,
            pool.minimumReputation,
            pool.creatorFeePercent,
            pool.roundDuration,
            pool.roundDeadline
        );
    }

    function getMembers(uint _poolId) external view validPool(_poolId) returns (address[] memory) {
        return pools[_poolId].members;
    }

    function hasJoined(uint _poolId, address _member) external view validPool(_poolId) returns (bool) {
        return pools[_poolId].hasJoined[_member];
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    function isActiveMember(uint _poolId, address _member) external view validPool(_poolId) returns (bool) {
        return pools[_poolId].activeMember[_member];
    }

    function getCollateral(uint _poolId, address _member) external view validPool(_poolId) returns (uint) {
        return pools[_poolId].collateralDeposited[_member];
    }
}
