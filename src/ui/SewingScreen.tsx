import { useEffect, useState } from 'react';
import { useGame } from '../state/game';
import { Stage } from '../scene/Stage';
import { Plush } from '../scene/Plush';
import { SEWING_SECONDS, sewingCaption, sewingLook, sewingStage } from '../scene/sewing';

const TICK_MS = 50;

export function SewingScreen() {
  const design = useGame((s) => s.design);
  const finishSewing = useGame((s) => s.finishSewing);
  const [t, setT] = useState(0);
  const stage = sewingStage(t);

  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => setT((performance.now() - start) / 1000), TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (stage === 'done') finishSewing();
  }, [stage, finishSewing]);

  return (
    <main className="sewing">
      <div className="stage">
        <Stage>
          <Plush design={design} {...sewingLook(t)} />
        </Stage>
      </div>
      <div className="sewing-bar">
        <p className="sewing-caption" aria-live="polite">
          {sewingCaption(stage)}
        </p>
        <progress max={SEWING_SECONDS} value={Math.min(t, SEWING_SECONDS)} aria-label="Sewing progress" />
        <button type="button" className="skip" onClick={finishSewing}>
          Skip ⏭️
        </button>
      </div>
    </main>
  );
}
