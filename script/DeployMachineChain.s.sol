// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/MachineChain.sol";

contract DeployMachineChain is Script {
    function run() external {
        vm.startBroadcast();

        address stablecoin = vm.envAddress("STABLECOIN_ADDRESS");
        address oracle = vm.envAddress("ORACLE_ADDRESS");

        new MachineChain(stablecoin, oracle);

        vm.stopBroadcast();
    }
}
