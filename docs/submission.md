# MACHINECHAIN — MONAD HACKATHON SUBMISSION

## Project

- **Name:** MachineChain
- **Tagline:** Parametric industrial insurance triggered by AI. No adjusters. No delays. Automatic.
- **Track:** AI + DeFi / Real World Assets
- **Team:** AZControl AI-First Unit — Monterrey, Mexico

## Problem

Plants in Nuevo Leon lose up to $9,000 USD per hour of unplanned downtime.
Most industrial companies cannot calculate their real downtime cost, and when a critical machine fails, insurance claims can take days or weeks.

## Solution

MachineChain is a parametric industrial insurance protocol built on Monad.
When an AI model detects a confirmed equipment failure via sensor data, a smart contract automatically releases the insurance payout.

## How it works

1. **Sensor data in**
   - Vibration, temperature, pressure and current stream from industrial equipment.
   - Example sources: Balluff and Festo sensor networks.
2. **AI anomaly detection**
   - A model classifies true failures versus noise.
   - It logs timestamp, equipment ID and failure type.
3. **Automatic payout on Monad**
   - Contract verifies active policy, covered asset, confidence threshold and cooldown.
   - If valid, USDC is released to the plant wallet.

## Why Monad

- 10,000 TPS for many plants and frequent sensor-triggered events
- EVM compatible, so Solidity tooling works directly
- Fast finality for near-instant payout UX
- Low fees for viable micro-transactions
- Parallel execution for simultaneous claims

## Business model

1. Premium per machine: $200 to $800 USD per month
2. Protocol fee: 3% of every processed claim
3. Data layer: anonymized industrial failure patterns

## Unfair advantage

AZControl has long-standing industrial distribution access and direct commercial relationships with target plants in Nuevo Leon.

## Demo script

- Show normal readings first
- Force anomaly on reading 10
- Trigger claim on Monad
- Show transaction confirmation and payout event
