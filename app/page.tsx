'use client';

import { useEffect, useState } from 'react';

const MACHINECHAIN = {
  address: '0xfdd5f90ac2ee4ab0ad5730a1dd4cb5cce2a91d19',
  stablecoin: '0x2ea4c1fc8787afC4980582c0878469bA6D41A337',
  oracle: '0xBdC9C332237c2308a40715bdB4cab65aA3f9f8A6',
};

type Reading = { t: number; current: string; temperature: string; status: 'normal' | 'spike' };

type ClaimFlags = {
  policyActive: 0 | 1;
  policyNotExpired: 0 | 1;
  cooldownOk: 0 | 1;
  confidenceOk: 0 | 1;
  claimIdFresh: 0 | 1;
};

export default function Page() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [claimFlags, setClaimFlags] = useState<ClaimFlags>({
    policyActive: 0,
    policyNotExpired: 0,
    cooldownOk: 0,
    confidenceOk: 0,
    claimIdFresh: 0,
  });
  const [sensorActive, setSensorActive] = useState<0 | 1>(0);
  const [startedOnce, setStartedOnce] = useState<0 | 1>(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTick((prev) => {
        const next = prev + 1;
        const current = (11.5 + Math.random() * 1.5).toFixed(2);
        const temperature = (58 + Math.random() * 8).toFixed(1);
        const status: 'normal' | 'spike' = next === 10 ? 'spike' : 'normal';
        setReadings((items) => [{ t: next, current, temperature, status }, ...items].slice(0, 12));
        return next;
      });
      setStartedOnce(1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const setFlag = (key: keyof ClaimFlags, value: 0 | 1) => {
    setClaimFlags((prev) => ({ ...prev, [key]: value }));
  };

  const allOk = Object.values(claimFlags).every((v) => v === 1) && startedOnce === 1;

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', padding: '32px', fontFamily: 'ui-sans-serif, system-ui' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 24 }}>
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

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <div style={box}>
            <h2>Live Oracle</h2>
            <p style={{ color: '#cbd5e1' }}>Start/Stop/Reset para el muestreo de sensores alimentados con corriente y temperatura.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <button onClick={() => { setRunning(true); setStartedOnce(1); }} style={btn}>Start</button>
              <button onClick={() => setRunning(false)} style={btn}>Stop</button>
              <button onClick={() => { setRunning(false); setTick(0); setReadings([]); setStartedOnce(0); }} style={btn}>Reset</button>
            </div>
            <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
              <Info label="Estado" value={running ? 'Sampling sensors...' : 'Stopped'} />
              <Info label="Ticks" value={String(tick)} />
            </div>
            <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
              {readings.length ? readings.map((r) => <ReadingRow key={`sensor-${r.t}`} reading={r} />) : <div style={mini}>No hay muestras todavía.</div>}
            </div>
          </div>

          <div style={box}>
            <h2>Claim verification</h2>
            <p style={{ color: '#cbd5e1' }}>Cinco botones por condición, inicializan en 0 y se ponen en 1 manualmente.</p>
            <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
              <FlagRow label="Póliza activa" value={claimFlags.policyActive} onZero={() => setFlag('policyActive', 0)} onOne={() => setFlag('policyActive', 1)} />
              <FlagRow label="Póliza no vencida" value={claimFlags.policyNotExpired} onZero={() => setFlag('policyNotExpired', 0)} onOne={() => setFlag('policyNotExpired', 1)} />
              <FlagRow label="Cooldown 24h" value={claimFlags.cooldownOk} onZero={() => setFlag('cooldownOk', 0)} onOne={() => setFlag('cooldownOk', 1)} />
              <FlagRow label="Confianza ≥ 85" value={claimFlags.confidenceOk} onZero={() => setFlag('confidenceOk', 0)} onOne={() => setFlag('confidenceOk', 1)} />
              <FlagRow label="claimId no procesado" value={claimFlags.claimIdFresh} onZero={() => setFlag('claimIdFresh', 0)} onOne={() => setFlag('claimIdFresh', 1)} />
            </div>
            <div style={{ marginTop: 16, padding: 16, borderRadius: 18, border: `1px solid ${allOk ? '#22c55e' : '#1e293b'}`, background: allOk ? 'rgba(34,197,94,0.15)' : '#020617' }}>
              <div style={{ color: allOk ? '#4ade80' : '#94a3b8', fontWeight: 700, fontSize: 18 }}>{allOk ? 'PAGO EMITIDO' : 'PENDING'}</div>
              <div style={{ color: '#cbd5e1', marginTop: 6 }}>Si todo está en 1 y el Start de la primera simulación fue presionado, se emite el pago.</div>
            </div>
          </div>

          <div style={box}>
            <h2>SENSOR</h2>
            <p style={{ color: '#cbd5e1' }}>Módulo de estado, lee la primera simulación y la segunda en paralelo.</p>
            <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
              <Info label="Start presionado" value={String(startedOnce)} />
              <Info label="Póliza activa" value={String(claimFlags.policyActive)} />
              <Info label="Pago" value={allOk ? 'EMITIDO' : 'NO EMITIDO'} />
              <Info label="Sensor" value={sensorActive ? 'TRUE' : 'FALSE'} />
            </div>
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <button onClick={() => setSensorActive(0)} style={btn}>0</button>
              <button onClick={() => setSensorActive(1)} style={btn}>1</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return <div style={{ ...mini, borderColor: '#1e293b' }}><div style={{ color: '#94a3b8' }}>{title}</div><div style={{ color, fontSize: 28, fontWeight: 700 }}>{value}</div></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div style={{ ...mini }}><div style={{ color: '#94a3b8' }}>{label}</div><div style={{ wordBreak: 'break-all', fontWeight: 600 }}>{value}</div></div>; }
function ReadingRow({ reading }: { reading: Reading }) { return <div style={{ ...mini, borderColor: reading.status === 'spike' ? '#f59e0b' : '#1e293b' }}><b>t={reading.t}</b> · corriente {reading.current}A · temp {reading.temperature}°C {reading.status === 'spike' ? '· SPIKE' : ''}</div>; }
function FlagRow({ label, value, onZero, onOne }: { label: string; value: 0 | 1; onZero: () => void; onOne: () => void; }) {
  return <div style={{ ...mini, display: 'grid', gap: 8 }}>
    <div><b>{label}</b> · estado: {value}</div>
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={onZero} style={btn}>0</button>
      <button onClick={onOne} style={btn}>1</button>
    </div>
  </div>;
}

const box: React.CSSProperties = { border: '1px solid #1e293b', background: '#0f172a', borderRadius: 24, padding: 24 };
const mini: React.CSSProperties = { border: '1px solid #1e293b', background: '#020617', borderRadius: 18, padding: 16 };
const btn: React.CSSProperties = { padding: '12px 16px', borderRadius: 14, border: '1px solid #334155', background: '#111827', color: '#e2e8f0', cursor: 'pointer' };
