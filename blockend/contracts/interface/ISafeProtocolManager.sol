// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "@safe-global/safe-contracts/contracts/Safe.sol";
import {SafeTransaction,SafeRootAccess} from"@safe-global/safe-core-protocol/contracts/DataTypes.sol";

interface ISafeProtocolManager {

    function executeTransaction(Safe safe, SafeTransaction memory tx) external view returns (bytes[] memory data);
    function executeRootAccess(Safe safe, SafeRootAccess memory rootAccess) external view returns (bytes memory data);

    function enablePlugin(address plugin, uint8 permissions) external;

    function isDailyGMSafe(address addr) external view returns (bool);
}