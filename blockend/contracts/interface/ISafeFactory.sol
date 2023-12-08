// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;

interface ISafeFactory {
    function createSafe(string memory name, string memory metadata,address tokenAddress,uint256 tokenAmount,address _manager,address _erc4337plugin,address initializer) external returns (address safe);

}