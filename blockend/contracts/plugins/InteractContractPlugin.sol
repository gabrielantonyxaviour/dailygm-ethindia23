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

import "../interface/ILogAutomation.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract InteractContractPlugin is BasePluginWithEventMetadata,FunctionsClient,ILogAutomation{
    using Strings for uint256;
    using FunctionsRequest for FunctionsRequest.Request;  


    struct Target{
        ISafe safe;
        address caller;
        uint64 destinationChainSelector;
    }
    struct VerifyParams{
        string contractAddress;
        string eventSignature;
        string blockNumber;
        string index;
        uint256 rewardAmount;
        address rewardToken;
    }

    mapping(address=>VerifyParams) public safeToVerifyParams;

    address public manager;
    address public rewardToken;
    bytes32 public donId;
    address public functionsRouter;
    address public crosschainRouter;
    string public sourceCode;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint32 public s_callbackGasLimit=300000;
    uint64 public s_subscriptionId=1134;
    address public i_link;
    mapping(bytes32=>Target) public requestIdToTarget;


    event VerificationSuccess(bytes32 requestId);
    event VerificationFailedWithReason(string reason);
    event OracleReturned(bytes32 requestId, bytes response, bytes error);

    constructor(address _manager,bytes32 _donId,address _functionsRouter,address _crossChainRouter,address _link,string memory _sourceCode)
        BasePluginWithEventMetadata(
            PluginMetadata({name: "Interact Contract Plugin", version: "1.0.0", requiresRootAccess: false, iconUrl: "", appUrl: ""})
        )
        FunctionsClient(_functionsRouter)
    {
        manager = _manager;
        sourceCode=_sourceCode;
        functionsRouter=_functionsRouter;
        donId=_donId;
    }

    modifier onlyManager {
        require(msg.sender==manager,"Only manager");
        _;
    }

    function setupPlugin(address safe,string memory contractAddress,string memory _eventSignature, string memory _index,uint rewardAmount,address _rewardToken) external /*onlyManager*/  {
        safeToVerifyParams[safe] = VerifyParams({
            contractAddress:contractAddress,
            eventSignature:_eventSignature,
            blockNumber: block.number.toString(),
            index:_index,
            rewardAmount:rewardAmount,
            rewardToken:_rewardToken
        });
        // followHandle=_followHandle;
        rewardToken=_rewardToken;

    }   
  
    function executeFromPlugin(
        ISafe safe,
        uint8 slotId,
        uint64 version,
        uint64 _destinationChainSelector,
        string memory bytes32String
    ) external returns (bytes[] memory data) {
        FunctionsRequest.Request memory req;
        VerifyParams memory verifyParams=safeToVerifyParams[address(safe)];
        req.initializeRequestForInlineJavaScript(sourceCode);
        if (version > 0) {
          req.addDONHostedSecrets(slotId,version);
        }
        string[] memory args=new string[](2);
        args[0]=verifyParams.contractAddress;
        args[1]=verifyParams.blockNumber;
        args[2]=verifyParams.eventSignature;
        args[3]=verifyParams.index;
        args[4]=bytes32String;


        // args[1]=followHandle;
        req.setArgs(args);
        s_lastRequestId = _sendRequest(req.encodeCBOR(), s_subscriptionId, s_callbackGasLimit, donId);
        requestIdToTarget[s_lastRequestId]=Target(safe,msg.sender,_destinationChainSelector);
    }

   
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        if (response.length > 0) {
            // _executeFromPlugin(requestIdToSafe[requestId]);
            emit VerificationSuccess(requestId);
        }else{
            emit VerificationFailedWithReason(string(response));
        }
        s_lastResponse = response;
        s_lastError = err;
        emit OracleReturned(requestId, response, err);
    }
    
    function checkLog(
        Log calldata log,
        bytes memory
    ) external pure returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = true;
        performData = log.data;
    }

    function performUpkeep(bytes calldata performData) external override {
        bytes32 _requestId = abi.decode(performData, (bytes32));
        _executeFromPlugin(requestIdToTarget[_requestId]);
    }


     function _executeFromPlugin(Target memory target)
        internal
        returns (bytes[] memory data)
    {   
        SafeTransaction memory safeTx = SafeTransaction({
            actions: new SafeProtocolAction[](3),
            nonce: Safe(address(target.safe)).nonce(),
            metadataHash: bytes32(0)
        });
        VerifyParams memory verifyParams=safeToVerifyParams[address(target.safe)];
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: verifyParams.rewardToken, amount: verifyParams.rewardAmount});
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(target.caller),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: "",
            feeToken:  i_link 
        });

        uint256 fee = IRouterClient(crosschainRouter).getFee(
            target.destinationChainSelector,
            message
        );
        
        safeTx.actions[0] = SafeProtocolAction({
            to: payable(verifyParams.rewardToken),
            value: 0,
            data: abi.encodeWithSignature("approve(address,uint256)", crosschainRouter, verifyParams.rewardAmount)
        });

        safeTx.actions[1] = SafeProtocolAction({
            to: payable(i_link),
            value: 0,
            data: abi.encodeWithSignature("approve(address,uint256)", crosschainRouter, fee)
        });

        safeTx.actions[2] = SafeProtocolAction({
            to: payable(crosschainRouter),
            value: 0,
            data: abi.encodeWithSignature("ccipSend(uint64,(bytes,bytes,(address,uint256),address,bytes))",target.destinationChainSelector,message)
        });

        (data)=ISafeProtocolManager(manager).executeTransaction(target.safe, safeTx);
    }   

    function requiresPermissions() external view returns (uint8 permissions){
        return 1;
    }
    function addressToString(address _address) public pure returns (string memory) {
        return uint256(uint160(_address)).toString();
    }

}