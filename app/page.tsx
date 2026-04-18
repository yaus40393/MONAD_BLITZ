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
            <p style={{ color: '#cbd5e1' }}>Claim verification se mantiene en 0 hasta que las cinco condiciones de la simulación 2 estén en 1.</p>
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
            <h2>Claim verification</h2>
            <p style={{ color: '#cbd5e1' }}>Se mantiene en 0 hasta que las cinco condiciones de la simulación 2 estén en 1.</p>
            <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
              <Info label="Póliza activa" value={String(claimFlags.policyActive)} />
              <Info label="Póliza no vencida" value={String(claimFlags.policyNotExpired)} />
              <Info label="Cooldown 24h" value={String(claimFlags.cooldownOk)} />
              <Info label="Confianza ≥ 85" value={String(claimFlags.confidenceOk)} />
              <Info label="claimId no procesado" value={String(claimFlags.claimIdFresh)} />
            </div>
            <div style={{ marginTop: 16, padding: 16, borderRadius: 18, border: `1px solid ${allOk ? '#22c55e' : '#1e293b'}`, background: allOk ? 'rgba(34,197,94,0.15)' : '#020617' }}>
              <div style={{ color: allOk ? '#4ade80' : '#94a3b8', fontWeight: 700, fontSize: 18 }}>{allOk ? 'PAGO EMITIDO' : 'PENDING'}</div>
              <div style={{ color: '#cbd5e1', marginTop: 6 }}>Cuando todo esté en 1, se emite el pago.</div>
            </div>
          </div>

          <div style={box}>
            <h2>Sensor status</h2>
            <p style={{ color: '#cbd5e1' }}>Indicador visual simple, sin botón de control propio.</p>
            <div style={{ marginTop: 20, padding: 16, borderRadius: 18, border: '1px solid #1e293b', background: '#020617' }}>
              <div style={{ color: startedOnce ? '#4ade80' : '#94a3b8', fontWeight: 700, fontSize: 18 }}>{startedOnce ? 'SENSOR TRUE' : 'SENSOR FALSE'}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
// confirmation
