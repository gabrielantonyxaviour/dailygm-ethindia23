// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;

interface IAccount {
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        uint8 operation
    ) external returns (bool success, bytes memory returnData);

    function checkSignatures(bytes32 messageHash, bytes memory signatures) external view;
}