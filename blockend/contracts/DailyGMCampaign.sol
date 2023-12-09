// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./interface/Safe.sol";
import "./interface/SafeProxyFactory.sol";
import "./interface/SafeProxy.sol";
'
contract DailyGMCampaign{

    address public safeSingleton;
    SafeProxyFactory public safeProxyFactory;
    address public manager;

    struct CreateCampaignInputParams{
        string name;
        string metadata;
        address rewardTokenAddress;
        uint256 tokenAmount;
        address[] quests;
        bytes[] data;
        address[] owners;
        uint256 threshold;
    }

    constructor(address _safe,SafeProxy _safeProxyFactory,address _manager){
        safeSingleton=_safe;
        safeProxyFactory=_safeProxyFactory;
        manager=_manager;
    }

    event CampaignCreated();


    function createCampaign(CreateCampaignInputParams memory params) external{  
        require(IERC20(params.rewardTokenAddress).allowance(msg.sender, address(this))>=params.tokenAmount,"Approve reward tokens");

        SafeProxy safe=SafeProxyFactory(safeProxyFactory).createProxyWithNonce(safeSingleton,abi.encodeWithSignature("setup(address[],uint256,address,bytes,address,address,address,uint256,address)",params.owners,threshold,address(0),"",manager,address(0),0,payable(address(0))));
        
        IERC20(rewardTokenAddress).transferFrom(msg.sender, address(safe), params.tokenAmount);
        
        isSafe[safe]=true;
        emit CampaignCreated(params.name,params.metadata,safe,msg.sender,params.rewardTokenAddress,params.tokenAmount,params.quests);
    }







}