'use client';

import { useMemo, useState } from 'react';

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

type Reading = {
  t: number;
  current: string;
  temperature: string;
  status: 'normal' | 'spike';
};

export default function Page() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [readings, setReadings] = useState<Reading[]>([]);

  useMemo(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setTick((prev) => {
        const next = prev + 1;
        const current = (11.5 + Math.random() * 1.5).toFixed(2);
        const temperature = (58 + Math.random() * 8).toFixed(1);
        const status = (next === 10 ? 'spike' : 'normal') as 'normal' | 'spike';
        setReadings((items) => [
          {
            t: next,
            current,
            temperature,
            status,
          },
          ...items,
        ].slice(0, 12));
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const stop = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setTick(0);
    setReadings([]);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', padding: '32px', fontFamily: 'ui-sans-serif, system-ui' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 24 }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 12px', border: '1px solid #0891b2', borderRadius: 999, color: '#67e8f9' }}>Monad hackathon demo</div>
            <h1 style={{ fontSize: 56, lineHeight: 1, marginTop: 16, marginBottom: 16 }}>MachineChain</h1>
            <p style={{ fontSize: 18, color: '#cbd5e1' }}>Parametric industrial insurance triggered by AI, built for Monad testnet.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
              <Card title="Settlement" value="&lt;10s" color="#4ade80" />
              <Card title="AI confidence" value="94%" color="#22d3ee" />
              <Card title="Payout" value="$5,000 USDC" color="#e879f9" />
            </div>
          </div>

          <aside style={box}>
            <h2>MachineChain</h2>
            <Info label="Contract" value={MACHINECHAIN.address} />
            <Info label="Oracle" value={MACHINECHAIN.oracle} />
            <Info label="Stablecoin" value={MACHINECHAIN.stablecoin} />
            <Info label="Chain" value="Monad Testnet (10143)" />
          </aside>
        </section>

        <section style={box}>
          <h2>Live Oracle</h2>
          <p style={{ color: '#cbd5e1' }}>Simulación de sensores alimentados con corriente y temperatura. Start inicia el muestreo, Stop lo pausa y Reset lo reinicia.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <button onClick={start} style={btn}>Start</button>
            <button onClick={stop} style={btn}>Stop</button>
            <button onClick={reset} style={btn}>Reset</button>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
            <Info label="Estado" value={running ? 'Sampling sensors...' : 'Stopped'} />
            <Info label="Ticks" value={String(tick)} />
          </div>
          <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
            {readings.length ? readings.map((r) => <ReadingRow key={r.t} reading={r} />) : <div style={mini}>No hay muestras todavía.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return <div style={{ ...mini, borderColor: '#1e293b' }}><div style={{ color: '#94a3b8' }}>{title}</div><div style={{ color, fontSize: 28, fontWeight: 700 }}>{value}</div></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div style={{ ...mini, marginTop: 10 }}><div style={{ color: '#94a3b8' }}>{label}</div><div style={{ wordBreak: 'break-all', fontWeight: 600 }}>{value}</div></div>; }
function ReadingRow({ reading }: { reading: Reading }) {
  return <div style={{ ...mini, borderColor: reading.status === 'spike' ? '#f59e0b' : '#1e293b' }}>
    <b>t={reading.t}</b> · corriente {reading.current}A · temp {reading.temperature}°C {reading.status === 'spike' ? '· SPIKE' : ''}
  </div>;
}

const box: React.CSSProperties = { border: '1px solid #1e293b', background: '#0f172a', borderRadius: 24, padding: 24 };
const mini: React.CSSProperties = { border: '1px solid #1e293b', background: '#020617', borderRadius: 18, padding: 16 };
const btn: React.CSSProperties = { padding: '12px 16px', borderRadius: 14, border: '1px solid #334155', background: '#111827', color: '#e2e8f0', cursor: 'pointer' };
