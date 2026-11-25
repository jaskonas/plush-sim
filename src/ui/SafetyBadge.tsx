import { safetyCheck } from '../sim/safety';
import { AUDIENCES } from '../sim/catalog/groups';
import type { Design } from '../sim/design';

/** The safety lab's verdict for the chosen audience. */
export function SafetyBadge({ design }: { design: Design }) {
  const result = safetyCheck(design);
  const who = AUDIENCES[design.audience].label.replace(/ \(.*\)/, '').toLowerCase();
  return (
    <div className={result.ok ? 'safety ok' : 'safety fail'} data-testid="safety" role="status">
      {result.ok ? (
        <>🧪 Safety lab: passed for {who}</>
      ) : (
        <>
          🧪 Fix first:
          <ul>
            {result.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
