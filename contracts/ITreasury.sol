//SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

interface ITreasury {
    function deposit(address staker, uint256 amount) external;

    function withdraw(address staker, uint256 amount) external;
}
