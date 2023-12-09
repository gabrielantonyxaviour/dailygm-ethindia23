// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.18;


import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../interface/Safe.sol";
 
import {ISafe} from "@safe-global/safe-core-protocol/contracts/interfaces/Accounts.sol";
import {ISafeProtocolManager} from "@safe-global/safe-core-protocol/contracts/interfaces/Manager.sol";
import {SafeTransaction, SafeProtocolAction} from "@safe-global/safe-core-protocol/contracts/DataTypes.sol";
import {BasePluginWithEventMetadata, PluginMetadata} from "./BasePlugin.sol";

contract LensFollowPlugin is BasePluginWithEventMetadata,FunctionsClient {
    using Strings for uint256;
    using FunctionsRequest for FunctionsRequest.Request;  
    bytes public releaseFundsData;
    mapping(address=>bool) public safeAddresses;
    string public followHandle;
    address public manager;
    bytes32 public donId;
    address public functionsRouter;
    string public sourceCode;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint32 public s_callbackGasLimit=300000;
    uint64 public s_subscriptionId=1134;
    mapping(bytes32=>ISafe) public requestIdToSafe;


    event VerificationSuccess();
    event VerificationFailedWithReason(string reason);
  event OracleReturned(bytes32 requestId, bytes response, bytes error);

    constructor(address _manager,bytes32 _donId,address _functionsRouter,string memory _sourceCode)
        BasePluginWithEventMetadata(
            PluginMetadata({name: "Lens Follow Plugin", version: "1.0.0", requiresRootAccess: false, iconUrl: "", appUrl: ""})
        )
        FunctionsClient(_functionsRouter)
    {
        manager = _manager;
        sourceCode=_sourceCode;
        functionsRouter=_functionsRouter;
        donId=_donId;
    }


    function setupSafe(string memory _followHandle,uint rewardAmount) external {
        safeAddresses[msg.sender] = true;
        followHandle=_followHandle;
        releaseFundsData=abi.encodeWithSignature("releaseFunds(uint256)", rewardAmount);
    }

    function executeFromPlugin(
        ISafe safe,
        uint8 slotId,
        uint64 version
    ) external returns (bytes[] memory data) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sourceCode);
        if (version > 0) {
          req.addDONHostedSecrets(slotId,version);
        }
        string[] memory args=new string[](2);
        args[0]=addressToString(msg.sender);
        args[1]=followHandle;
        req.setArgs(args);
        s_lastRequestId = _sendRequest(req.encodeCBOR(), s_subscriptionId, s_callbackGasLimit, donId);
        requestIdToSafe[s_lastRequestId]=safe;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        if (response.length > 0) {
            _executeFromPlugin(requestIdToSafe[requestId]);
            emit VerificationSuccess();
        }else{
            emit VerificationFailedWithReason(string(response));
        }
        s_lastResponse = response;
        s_lastError = err;
        emit OracleReturned(requestId, response, err);
    }

     function _executeFromPlugin(ISafe safe)
        internal
        returns (bytes[] memory data)
    {   
        SafeTransaction memory safeTx = SafeTransaction({
            actions: new SafeProtocolAction[](1),
            nonce: Safe(address(safe)).nonce(),
            metadataHash: bytes32(0)
        });
        safeTx.actions[0] = SafeProtocolAction({
            to: payable(address(safe)),
            value: 0,
            data: releaseFundsData
        });
        (data)=ISafeProtocolManager(manager).executeTransaction(safe, safeTx);
    }   

    function requiresPermissions() external view returns (uint8 permissions){
        return 1;
    }
    function addressToString(address _address) public pure returns (string memory) {
        return uint256(uint160(_address)).toString();
    }

}