// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;




interface IDailyGMSafe{



     function initialize(string memory name, string memory metadata,address tokenAddress,uint256 tokenAmount,address manager,address _initializer) external;

     function addQuest(address questId,bytes memory data) external;
     
     
}