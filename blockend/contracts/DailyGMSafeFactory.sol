// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;



import "./interface/IDailyGMSafe.sol";
import "@openzeppelin/contracts/utils/Create2.sol";



contract DailyGMSafeFactory{

    uint256 public nonce;
    address public manager;
    address public implementation;

    event DailyGMSafeCreated(address indexed safe, address indexed owner);


    constructor(address _manager,address _implementation) {
        manager = _manager;
        implementation=_implementation; 
        nonce=0;
    }   

    function createSafe(string memory name, string memory metadata,address tokenAddress,uint256 tokenAmount,address _manager,address _erc4337plugin,address initializer) external returns (address safe) {
        safe = _deployProxy(implementation, nonce);
        IDailyGMSafe(safe).initialize(name,metadata,tokenAddress,tokenAmount,_manager,_erc4337plugin,initializer);
        emit DailyGMSafeCreated(safe, initializer);
        nonce++;
        return safe;
    }


    function _deployProxy(
        address _implementation,
        uint _salt
    ) internal returns (address _contractAddress) {
        bytes memory code = _creationCode(_implementation, _salt);
        _contractAddress = Create2.computeAddress(
            bytes32(_salt),
            keccak256(code)
        );
        if (_contractAddress.code.length != 0) return _contractAddress;

        _contractAddress = Create2.deploy(0, bytes32(_salt), code);
    }

    function _creationCode(
        address implementation_,
        uint256 _salt_
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
                implementation_,
                hex"5af43d82803e903d91602b57fd5bf3",
                abi.encode(_salt_)
            );
    }





    
}