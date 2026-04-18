# MachineChain

MachineChain is a parametric industrial insurance demo built for Monad testnet.

## What the frontend does

This frontend is a live demo of the protocol. It:

- shows the real MachineChain contract address
- shows the Monad testnet network details
- reads contract data on-chain
- simulates the oracle sensor stream visually
- lets you connect a wallet with the browser extension
- exposes buttons for contract actions:
  - createPolicy
  - fundPool
  - triggerClaim

## What the wallet button should do

When you click **Connect wallet**, the app should:

1. Detect a browser wallet extension
2. Ask for permission to connect
3. Let you choose one of your accounts
4. Confirm or switch to Monad testnet if needed
5. Show your connected address in the UI
6. Enable the write actions

If nothing happens, usually one of these is true:

- no wallet extension is installed
- the extension blocked the popup
- the page is still cached and not using the latest build
- the wallet is on the wrong network

## Network

- Chain ID: `10143`
- RPC: `https://testnet-rpc.monad.xyz`
- Explorer: `https://testnet.monadexplorer.com`
- Faucet: `https://faucet.monad.xyz`

## Contract

```js
const MACHINECHAIN = {
  address: "0xfdd5f90ac2ee4ab0ad5730a1dd4cb5cce2a91d19",
  stablecoin: "0x2ea4c1fc8787afC4980582c0878469bA6D41A337",
  oracle: "0xBdC9C332237c2308a40715bdB4cab65aA3f9f8A6",
};
```

