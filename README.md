# MachineChain

Parametric industrial insurance triggered by AI on Monad.

## What it does

MachineChain detects equipment failure from industrial sensor data and automatically triggers an on-chain insurance payout.

Flow:
1. Sensors stream machine telemetry.
2. An AI oracle classifies anomalies.
3. A Monad smart contract verifies policy conditions.
4. USDC payout is released automatically.

## Repo structure

- `contracts/MachineChain.sol` — insurance protocol smart contract
- `scripts/machinechain_oracle.py` — demo oracle simulator
- `docs/submission.md` — hackathon submission narrative

## Demo flow

1. Create and fund a policy for a machine.
2. Run the oracle simulator.
3. Force an anomaly on reading 10.
4. Trigger `triggerClaim()` on the contract.
5. Show payout event and tx on Monad testnet.

## Why Monad

- High throughput
- EVM compatibility
- Low fees
- Fast finality
- Parallel execution

## Next suggested steps

- Add Foundry or Hardhat config
- Deploy contract to Monad testnet
- Replace simulated oracle call with real transaction sending
- Add a simple dashboard for the live demo
