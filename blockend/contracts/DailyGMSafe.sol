// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import {ModuleManager} from "@safe-global/safe-contracts/contracts/base/ModuleManager.sol";
import {OwnerManager} from "@safe-global/safe-contracts/contracts/base/OwnerManager.sol";
import {FallbackManager} from "@safe-global/safe-contracts/contracts/base/FallbackManager.sol";
import {NativeCurrencyPaymentFallback} from "@safe-global/safe-contracts/contracts/common/NativeCurrencyPaymentFallback.sol";
import {Singleton} from "@safe-global/safe-contracts/contracts/common/Singleton.sol";
import {SignatureDecoder} from "@safe-global/safe-contracts/contracts/common/SignatureDecoder.sol";
import {SecuredTokenTransfer} from "@safe-global/safe-contracts/contracts/common/SecuredTokenTransfer.sol";
import {StorageAccessible} from "@safe-global/safe-contracts/contracts/common/StorageAccessible.sol";
import {Enum} from "@safe-global/safe-contracts/contracts/common/Enum.sol";
import {ISignatureValidator, ISignatureValidatorConstants} from "@safe-global/safe-contracts/contracts/interfaces/ISignatureValidator.sol";
import {SafeMath} from "@safe-global/safe-contracts/contracts/external/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interface/IDailyGMSafe.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/ISafeProtocolManager.sol";  

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
  * minimal account.
  *  this is sample minimal account.
  *  has execute, eth handling methods
  *  has a single signer that can send requests through the entryPoint.
  */
contract DailyGMSafe is  
    Singleton,
    NativeCurrencyPaymentFallback,
    ModuleManager,
    OwnerManager,
    SignatureDecoder,
    SecuredTokenTransfer,
    ISignatureValidatorConstants,
    FallbackManager,
    StorageAccessible ,IDailyGMSafe{
    using SafeMath for uint256;
    using ECDSA for bytes32;
    

    string public constant VERSION = "0.0.1";

    address public owner;
    address public manager;
    address public rewardToken;

    bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH = 0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218;
    bytes32 private constant SAFE_TX_TYPEHASH = 0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8;

    mapping(address=>uint256) public rewards;

    IEntryPoint private immutable _entryPoint;
    uint256 public nonce;
    bytes32 private _deprecatedDomainSeparator;
    address public erc4337Plugin;
    address public router;
    address public i_link;
    uint64 public sourceChainSelector;

    event DailyGMSafeInitialized(string name, string metadata,address tokenAddress,uint256 tokenAmount,address manager,address erc4337Plugin,address initializer);
    event TokensSentCroschain(bytes32 indexed messageId, address indexed receiver,uint256 amount,uint64 destinationChainSelector);
    event PluginAdded(uint256 questId);
    modifier onlyOwner() {  
        _onlyOwner();
        _;
    }

    modifier onlyManager()
    {
        require(msg.sender==manager, "Only manager");
        _;
    }

   constructor(IEntryPoint anEntryPoint,address _rewardToken,uint64 _sourceChainSelector, address _router, address _linkToken) {
        _entryPoint = anEntryPoint;
        rewardToken = _rewardToken;
        threshold=1;
        sourceChainSelector=_sourceChainSelector;
        i_link=_linkToken;
        router=_router;
    }

    event SafeSetup(address indexed initiator, address[] owners, uint256 threshold, address initializer, address fallbackHandler);
    event ApproveHash(bytes32 indexed approvedHash, address indexed owner);
    event SignMsg(bytes32 indexed msgHash);
    event ExecutionFailure(bytes32 indexed txHash, uint256 payment);
    event ExecutionSuccess(bytes32 indexed txHash, uint256 payment);



    function initialize(string memory name, string memory metadata,address tokenAddress,uint256 tokenAmount,address _manager,address _erc4337Plugin,address _initializer) external{
        _initialize(name,metadata,tokenAddress,tokenAmount,_manager,_erc4337Plugin,_initializer);
    }


    function _initialize(string memory name, string memory metadata,address tokenAddress,uint256 tokenAmount,address _manager,address _erc4337Plugin,address _initializer) internal virtual {
        manager = _manager;
        erc4337Plugin=_erc4337Plugin;
        setupModules(erc4337Plugin, abi.encodeWithSignature("initialize(string,string,address,uint256,address)", name, metadata,tokenAddress,tokenAmount,manager));
        if(erc4337Plugin!=address(0))internalSetFallbackHandler(erc4337Plugin);

        address[] memory owners = new address[](1);
        
        emit DailyGMSafeInitialized(name, metadata,tokenAddress,tokenAmount,manager,erc4337Plugin,_initializer);
        emit SafeSetup(_initializer, owners, 1, msg.sender, erc4337Plugin);
    }
    

    function execTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures
    ) public payable virtual returns (bool success) {
        bytes32 txHash;
        // Use scope here to limit variable lifetime and prevent `stack too deep` errors
        {
            txHash = getTransactionHash( // Transaction info
                to,
                value,
                data,
                operation,
                safeTxGas,
                // Payment info
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                // Signature info
                // We use the post-increment here, so the current nonce value is used and incremented afterwards.
                nonce++
            );
            checkSignatures(txHash, signatures);
        }

        // We require some gas to emit the events (at least 2500) after the execution and some to perform code until the execution (500)
        // We also include the 1/64 in the check that is not send along with a call to counteract potential shortings because of EIP-150
        require(gasleft() >= ((safeTxGas * 64) / 63).max(safeTxGas + 2500) + 500, "GS010");
        // Use scope here to limit variable lifetime and prevent `stack too deep` errors
        {
            uint256 gasUsed = gasleft();
            // If the gasPrice is 0 we assume that nearly all available gas can be used (it is always more than safeTxGas)
            // We only substract 2500 (compared to the 3000 before) to ensure that the amount passed is still higher than safeTxGas
            success = execute(to, value, data, operation, gasPrice == 0 ? (gasleft() - 2500) : safeTxGas);
            gasUsed = gasUsed.sub(gasleft());
            // If no safeTxGas and no gasPrice was set (e.g. both are 0), then the internal tx is required to be successful
            // This makes it possible to use `estimateGas` without issues, as it searches for the minimum gas where the tx doesn't revert
            require(success || safeTxGas != 0 || gasPrice != 0, "GS013");
            // We transfer the calculated tx costs to the tx.origin to avoid sending it to intermediate contracts that have made calls
            uint256 payment = 0;
            if (gasPrice > 0) {
                payment = handlePayment(gasUsed, baseGas, gasPrice, gasToken, refundReceiver);
            }
            if (success) emit ExecutionSuccess(txHash, payment);
            else emit ExecutionFailure(txHash, payment);
        }
  
    }

    

    function handlePayment(
        uint256 gasUsed,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver
    ) private returns (uint256 payment) {
        // solhint-disable-next-line avoid-tx-origin
        address payable receiver = refundReceiver == address(0) ? payable(tx.origin) : refundReceiver;
        if (gasToken == address(0)) {
            // For native tokens, we will only adjust the gas price to not be higher than the actually used gas price
            payment = gasUsed.add(baseGas).mul(gasPrice < tx.gasprice ? gasPrice : tx.gasprice);
            (bool refundSuccess, ) = receiver.call{value: payment}("");
            require(refundSuccess, "GS011");
        } else {
            payment = gasUsed.add(baseGas).mul(gasPrice);
            require(transferToken(gasToken, receiver, payment), "GS012");
        }
    }




    function entryPoint() public view virtual returns (IEntryPoint) {
        return _entryPoint;
    }



    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(msg.sender == owner || msg.sender == address(this), "only owner");
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
     */
    function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        require(dest.length == func.length && (value.length == 0 || value.length == func.length), "wrong array lengths");
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], 0, func[i]);
            }
        } else {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], value[i], func[i]);
            }
        }
    }

    function checkContractSignature(address _owner, bytes32 dataHash, bytes memory signatures, uint256 offset) internal view {
        // Check that signature data pointer (s) is in bounds (points to the length of data -> 32 bytes)
        require(offset.add(32) <= signatures.length, "GS022");

        // Check if the contract signature is in bounds: start of data is s + 32 and end is start + signature length
        uint256 contractSignatureLen;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            contractSignatureLen := mload(add(add(signatures, offset), 0x20))
        }
        /* solhint-enable no-inline-assembly */
        require(offset.add(32).add(contractSignatureLen) <= signatures.length, "GS023");

        // Check signature
        bytes memory contractSignature;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            // The signature data for contract signatures is appended to the concatenated signatures and the offset is stored in s
            contractSignature := add(add(signatures, offset), 0x20)
        }
        /* solhint-enable no-inline-assembly */

        // require(ISignatureValidator(owner).isValidSignature(dataHash, contractSignature) == EIP1271_MAGIC_VALUE, "GS024");
    }

    function checkSignatures(bytes32 dataHash, bytes memory signatures) public view {
        
    }

  function checkNSignatures(address executor, bytes32 dataHash, bytes memory signatures, uint256 requiredSignatures) public view {
      
    }


    function approveHash(bytes32 hashToApprove) external {
       
    }

    function domainSeparator() public view returns (bytes32) {
        uint256 chainId;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            chainId := chainid()
        }
        /* solhint-enable no-inline-assembly */

        return keccak256(abi.encode(DOMAIN_SEPARATOR_TYPEHASH, chainId, this));
    }

    function encodeTransactionData(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver,
        uint256 _nonce
    ) private view returns (bytes memory) {
        bytes32 safeTxHash = keccak256(
            abi.encode(
                SAFE_TX_TYPEHASH,
                to,
                value,
                keccak256(data),
                operation,
                safeTxGas,
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                _nonce
            )
        );
        return abi.encodePacked(bytes1(0x19), bytes1(0x01), domainSeparator(), safeTxHash);
    }

    /**
     * @notice Returns transaction hash to be signed by owners.
     * @param to Destination address.
     * @param value Ether value.
     * @param data Data payload.
     * @param operation Operation type.
     * @param safeTxGas Gas that should be used for the safe transaction.
     * @param baseGas Gas costs for data used to trigger the safe transaction.
     * @param gasPrice Maximum gas price that should be used for this transaction.
     * @param gasToken Token address (or 0 if ETH) that is used for the payment.
     * @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
     * @param _nonce Transaction nonce.
     * @return Transaction hash.
     */
    function getTransactionHash(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver,
        uint256 _nonce
    ) public view returns (bytes32) {
        return keccak256(encodeTransactionData(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce));
    }
   
  function claimRewards(uint64 _destinationChainSelector) public {
      require(IERC20(rewardToken).balanceOf(address(this))>rewards[tx.origin], "Rewards depleted");
      if(_destinationChainSelector==sourceChainSelector||_destinationChainSelector==0)
      {
        IERC20(rewardToken).transfer(msg.sender, rewards[msg.sender]);
      }else{
        _sendRewardsCrosschain(msg.sender, rewards[msg.sender],  _destinationChainSelector);
      }
  }

  function _sendRewardsCrosschain(address receiver, uint256 amount, uint64 _destinationChainSelector) internal {
        IERC20(rewardToken).approve(router, amount);
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: rewardToken, amount: amount});
         Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: "",
            feeToken: i_link 
        });

        uint256 fee = IRouterClient(router).getFee(
            _destinationChainSelector,
            message
        );

      require(LinkTokenInterface(i_link).balanceOf(address(this))>=fee, "Not enough LINK");
        bytes32 messageId;
        LinkTokenInterface(i_link).approve(router, fee);
            messageId = IRouterClient(router).ccipSend(
                _destinationChainSelector,
                message
            );
        emit TokensSentCroschain(messageId, receiver,amount,_destinationChainSelector);
        
    }

    function addQuest(address questId) external  onlyManager{
        ISafeProtocolManager(manager).enablePlugin(questId, 1);
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
    }


}