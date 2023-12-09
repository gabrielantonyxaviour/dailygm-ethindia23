// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./interface/Safe.sol";
import "./interface/SafeProxyFactory.sol";
import "./interface/SafeProxy.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DailyGMCampaign{

    struct CreateCampaignInputParams{
        string name;
        string metadata;
        address rewardTokenAddress;
        uint256 tokenAmount;
        address[] quests;
        bytes[] data;
        address[] owners;
        uint256 threshold;
        uint256 salt;
    }

    struct Campaign{
        string name;
        string metadata;
        address rewardTokenAddress;
        uint256 tokenAmount;
        address[] quests;
        address safe;
        address creator;
    }

    address public safeSingleton;
    SafeProxyFactory public safeProxyFactory;
    address public manager;
    mapping(address=>uint[]) public yourCampaigns;


    Campaign[] public campaigns;

    constructor(address _safe,SafeProxyFactory _safeProxyFactory,address _manager){
        safeSingleton=_safe;
        safeProxyFactory=_safeProxyFactory;
        manager=_manager;
    }

    event CampaignCreated(Campaign campaign);


    function createCampaign(CreateCampaignInputParams memory params) external{  
        require(IERC20(params.rewardTokenAddress).allowance(msg.sender, address(this))>=params.tokenAmount,"Approve reward tokens");

        SafeProxy safe=SafeProxyFactory(safeProxyFactory).createProxyWithNonce(safeSingleton,abi.encodeWithSignature("setup(address[],uint256,address,bytes,address,address,address,uint256,address)",params.owners,params.threshold,address(0),"",manager,address(0),0,payable(address(0))),params.salt);
        
        IERC20(params.rewardTokenAddress).transferFrom(msg.sender, address(safe), params.tokenAmount);

        Campaign memory _campaign=Campaign(params.name,params.metadata,params.rewardTokenAddress,params.tokenAmount,params.quests,address(safe),msg.sender);  
        campaigns.push(_campaign);
        yourCampaigns[msg.sender].push(campaigns.length-1);
        emit CampaignCreated(_campaign);
    }


    function getCampaign(uint256 campaignId)public view returns(Campaign memory campaign)
    {
        return campaigns[campaigns.length-1];
    }

    function getUserCampaignIds(address user) public view returns(uint256[] memory)
    {
        return yourCampaigns[user];
    }

    function getCampaignQuests(uint256 campaignId) public view returns(address[] memory)
    {
        return campaigns[campaignId].quests;
    }

}