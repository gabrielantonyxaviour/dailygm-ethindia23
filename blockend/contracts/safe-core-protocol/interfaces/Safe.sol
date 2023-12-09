// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.18;



interface Safe{

    function nonce() external view returns(uint256);
}