import { useGame } from '../state/game';
import { ANIMALS } from '../sim/catalog/animals';
import { STYLES } from '../sim/catalog/styles';
import { COLOURS } from '../sim/catalog/materials';
import { GROUPS } from '../sim/catalog/groups';
import { GROUP_IDS } from '../sim/catalog/ids';

export function StartScreen() {
  const trend = useGame((s) => s.trend);
  const startDesigning = useGame((s) => s.startDesigning);
  return (
    <main className="start">
      <section className="card market">
        <h2>📰 This year's toy market</h2>
        <p className="trend" data-testid="trend">
          🔥 Hot colour: <strong>{COLOURS[trend.colour].label}</strong> · Hot animal: <strong>{ANIMALS[trend.animal].label}</strong> · Hot
          style: <strong>{STYLES[trend.style].label}</strong>
        </p>
        <h3>Who buys stuffed animals</h3>
        <ul className="groups">
          {GROUP_IDS.map((g) => (
            <li key={g}>
              <span className="group-emoji" aria-hidden>
                {GROUPS[g].emoji}
              </span>
              <strong>{GROUPS[g].label}</strong>
              <span>{GROUPS[g].kidNote}</span>
            </li>
          ))}
        </ul>
        <p className="hint">Design a toy, set its price, and launch it. Can you make one that's loved <em>and</em> makes money?</p>
        <button type="button" className="big" onClick={startDesigning}>
          ✏️ Design a toy
        </button>
      </section>
    </main>
  );
}
