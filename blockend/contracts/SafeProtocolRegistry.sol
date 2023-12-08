// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.18;
import {ISafeProtocolRegistry} from "@safe-global/safe-core-protocol/contracts/interfaces/Registry.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Enum} from "@safe-global/safe-core-protocol/contracts/common/Enum.sol";
import {ISafeProtocolFunctionHandler, ISafeProtocolHooks, ISafeProtocolPlugin} from "@safe-global/safe-core-protocol/contracts/interfaces/Modules.sol";

contract SafeProtocolRegistry is ISafeProtocolRegistry, Ownable{
    mapping(address => ModuleInfo) public listedModules;

    struct ModuleInfo {
        uint64 listedAt;
        uint64 flaggedAt;
        uint8 moduleTypes;
    }

    uint8 public constant MODULE_TYPE_PLUGIN=1;
    uint8 public constant MODULE_TYPE_FUNCTION_HANDLER=2;
    uint8 public constant MODULE_TYPE_HOOKS=4;
    uint8 public constant MODULE_TYPE_SIGNATURE_VALIDATOR_HOOKS=8;
    uint8 public constant MODULE_TYPE_SIGNATURE_VALIDATOR=16;

    

    error CannotFlagModule(address module);
    error ModuleAlreadyListed(address module);
    error InvalidModuleType(address module, uint8 givenModuleType);
    error ModuleDoesNotSupportExpectedInterfaceId(address module, bytes4 expectedInterfaceId);

    event ModuleAdded(address indexed module);
    event ModuleFlagged(address indexed module);

    constructor(address initialOwner) Ownable(initialOwner){
        _transferOwnership(initialOwner);
    }

    /**
     * @notice This function returns information about a module
     * @param module Address of the module to be checked
     * @return listedAt Timestamp of listing the module. This value will be 0 if not listed.
     * @return flaggedAt Timestamp of falgging the module. This value will be 0 if not flagged.
     */
    function check(address module) external view returns (uint64 listedAt, uint64 flaggedAt) {
        ModuleInfo memory moduleInfo = listedModules[module];
        listedAt = moduleInfo.listedAt;
        flaggedAt = moduleInfo.flaggedAt;

    }

    /**
     * @notice Allows only owner to add a module. A module can be any address including zero address for now.
     *         This function does not permit adding a module twice. This function validates if module supports expected interfaceId.
     * @param module Address of the module
     * @param moduleTypes uint8 indicating the types of module
     */
    function addModule(address module, uint8 moduleTypes) external virtual {
        _addModule(module, moduleTypes);
    }

    function _addModule(address module, uint8 moduleTypes) internal {
        ModuleInfo memory moduleInfo = listedModules[module];

        // Check if module is already listed or if moduleTypes is greater than 8.
        if (moduleInfo.listedAt != 0) {
            revert ModuleAlreadyListed(module);
        }

        // Maximum allowed value of moduleTypes is 31. i.e. 2^0 (Plugin) + 2^1 (Function Handler) + 2^2 (Hooks) + 2^3 (Signature Validator hooks) + 2^4 (Signature Validator)
        if (moduleTypes > 31) {
            revert InvalidModuleType(module, moduleTypes);
        }

        optionalCheckInterfaceSupport(module, moduleTypes, MODULE_TYPE_PLUGIN, type(ISafeProtocolPlugin).interfaceId);
        optionalCheckInterfaceSupport(module, moduleTypes, MODULE_TYPE_FUNCTION_HANDLER, type(ISafeProtocolFunctionHandler).interfaceId);
        optionalCheckInterfaceSupport(module, moduleTypes, MODULE_TYPE_HOOKS, type(ISafeProtocolHooks).interfaceId);
      

        listedModules[module] = ModuleInfo(uint64(block.timestamp), 0, moduleTypes);
        emit ModuleAdded(module);
    }

    /**
     * @notice This function checks if module supports expected interfaceId. This function will revert if module does not support expected interfaceId.
     * @param module Address of the module
     * @param moduleTypes uint8 representing the types of module
     * @param moduleTypeToCheck uint8 representing the type of module to check
     * @param interfaceId bytes4 representing the interfaceId to check
     */
    function optionalCheckInterfaceSupport(address module, uint8 moduleTypes, uint8 moduleTypeToCheck, bytes4 interfaceId) internal view {
        if (moduleTypes & moduleTypeToCheck == moduleTypeToCheck && !IERC165(module).supportsInterface(interfaceId)) {
            revert ModuleDoesNotSupportExpectedInterfaceId(module, interfaceId);
        }
    }

    /**
     * @notice Allows only owner to flad a module. Only previously added module can be flagged.
     *         This function does not permit flagging a module twice.
     *         A module can be any address including zero address for now.
     * @param module Address of the module
     */
    function flagModule(address module) external onlyOwner {
        ModuleInfo memory moduleInfo = listedModules[module];

        if (moduleInfo.listedAt == 0 || moduleInfo.flaggedAt != 0) {
            revert CannotFlagModule(module);
        }

        listedModules[module] = ModuleInfo(moduleInfo.listedAt, uint64(block.timestamp), moduleInfo.moduleTypes);
        emit ModuleFlagged(module);
    }

    function supportsInterface(bytes4 interfaceId) external view override returns (bool) {
        return interfaceId == type(ISafeProtocolRegistry).interfaceId || interfaceId == type(IERC165).interfaceId;
    }
}