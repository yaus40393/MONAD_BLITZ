'use client';

import { useState } from 'react';
import { createPublicClient, http } from 'viem';

const MACHINECHAIN = {
  address: '0xfdd5f90ac2ee4ab0ad5730a1dd4cb5cce2a91d19',
  stablecoin: '0x2ea4c1fc8787afC4980582c0878469bA6D41A337',
  oracle: '0xBdC9C332237c2308a40715bdB4cab65aA3f9f8A6',
};

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz/'] } },
  blockExplorers: { default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' } },
  testnet: true,
} as const;

const abi = [
  { type: 'function', stateMutability: 'view', name: 'owner', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', stateMutability: 'view', name: 'oracle', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', stateMutability: 'view', name: 'stablecoin', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', stateMutability: 'nonpayable', name: 'createPolicy', inputs: [
    { name: 'equipmentId', type: 'bytes32' },
    { name: 'plant', type: 'address' },
    { name: 'coverageAmount', type: 'uint256' },
    { name: 'durationDays', type: 'uint256' },
  ], outputs: [] },
  { type: 'function', stateMutability: 'nonpayable', name: 'triggerClaim', inputs: [
    { name: 'equipmentId', type: 'bytes32' },
    { name: 'claimId', type: 'bytes32' },
    { name: 'confidenceScore', type: 'uint8' },
    { name: 'failureType', type: 'string' },
  ], outputs: [] },
] as const;

export default function Page() {
  const [log, setLog] = useState<string[]>(['MachineChain Oracle ready.']);

  const push = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 10));

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', padding: '32px', fontFamily: 'ui-sans-serif, system-ui' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24 }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 12px', border: '1px solid #0891b2', borderRadius: 999, color: '#67e8f9' }}>Monad hackathon demo</div>
            <h1 style={{ fontSize: 56, lineHeight: 1, marginTop: 16, marginBottom: 16 }}>MachineChain</h1>
            <p style={{ fontSize: 18, color: '#cbd5e1' }}>Parametric industrial insurance triggered by AI, built for Monad testnet.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
              <Card title="Settlement" value="<10s" color="#4ade80" />
              <Card title="AI confidence" value="94%" color="#22d3ee" />
              <Card title="Payout" value="$5,000 USDC" color="#e879f9" />
            </div>

            <div style={box}>
              <h2>Live oracle simulator</h2>
              <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                {log.map((x, i) => <Line key={i} text={x} />)}
              </div>
            </div>
          </div>

          <aside style={box}>
            <h2>On-chain status</h2>
            <Info label="Contract" value={MACHINECHAIN.address} />
            <Info label="Oracle" value={MACHINECHAIN.oracle} />
            <Info label="Stablecoin" value={MACHINECHAIN.stablecoin} />
            <Info label="Chain" value="Monad Testnet (10143)" />
          </aside>
        </section>

      </div>
    </main>
  );
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return <div style={{ ...mini, borderColor: '#1e293b' }}><div style={{ color: '#94a3b8' }}>{title}</div><div style={{ color, fontSize: 28, fontWeight: 700 }}>{value}</div></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div style={mini}><div style={{ color: '#94a3b8' }}>{label}</div><div style={{ wordBreak: 'break-all', fontWeight: 600 }}>{value}</div></div>; }
function Line({ text }: { text: string }) { return <div style={mini}>{text}</div>; }

const box: React.CSSProperties = { border: '1px solid #1e293b', background: '#0f172a', borderRadius: 24, padding: 24 };
const mini: React.CSSProperties = { border: '1px solid #1e293b', background: '#020617', borderRadius: 18, padding: 16 };
const panel: React.CSSProperties = { ...mini, marginTop: 12 };
const btn: React.CSSProperties = { padding: '12px 16px', borderRadius: 14, border: '1px solid #334155', background: '#111827', color: '#e2e8f0', cursor: 'pointer', marginTop: 8 };
