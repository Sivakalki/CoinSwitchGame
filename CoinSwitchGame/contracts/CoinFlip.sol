// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    // Events, state variables, and functions go here
    event Flipped(address indexed user, bool result);

    function flipCoin() public payable {
        require(msg.value > 0, "You need to send some ETH");
        bool result = (block.timestamp % 2 == 0); // Simple coin flip logic
        if (result) {
            payable(msg.sender).transfer(msg.value * 2); // Win: double the ETH
        }
        emit Flipped(msg.sender, result);
    }
}
