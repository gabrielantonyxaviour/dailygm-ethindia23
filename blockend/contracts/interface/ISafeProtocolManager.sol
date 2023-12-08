// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "@safe-global/safe-contracts/contracts/Safe.sol";

interface ISafeProtocolManager {
struct SafeTransaction {
    address safe;
    SafeProtocolAction[] actions;
    uint256 nonce;
    bytes32 metadataHash;
    }

struct SafeRootAccess {
    address safe;
    SafeProtocolAction action;
    uint256 nonce;
    bytes32 metadataHash;
}
struct SafeProtocolAction {
    address to;
    uint256 value;
    bytes data;
}
    function executeTransaction(Safe safe, SafeTransaction memory tx) external view returns (bytes[] memory data);
    function executeRootAccess(Safe safe, SafeRootAccess memory rootAccess) external view returns (bytes memory data);

    function enablePlugin(address plugin, uint8 permissions) external;
}