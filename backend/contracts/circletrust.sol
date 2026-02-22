// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CircleTrust {
    uint public contributionAmount;
    uint public maxMembers;
    uint public currentRound;
    address[] public members;
    mapping(address => bool) public hasJoined;

    constructor(uint _contributionAmount, uint _maxMembers) {
        contributionAmount = _contributionAmount;
        maxMembers = _maxMembers;
        currentRound = 0;
    }

    function joinPool() external payable {
        require(msg.value == contributionAmount, "Incorrect contribution amount");
        require(!hasJoined[msg.sender], "Already joined");
        require(members.length < maxMembers, "Pool is full");

        members.push(msg.sender);
        hasJoined[msg.sender] = true;
    }

    function distribute() external {
        require(members.length == maxMembers, "Pool is not full yet");
        require(currentRound < maxMembers, "All rounds completed");

        address recipient = members[currentRound];
        currentRound++;

        (bool success, ) = recipient.call{value: contributionAmount}("");
        require(success, "Transfer failed");
    }

    function getMembers() external view returns (address[] memory) {
        return members;
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }
}
