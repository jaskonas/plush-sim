import { costToMake, profitPerToy, yourShare } from '../sim/cost';
import { formatMoney } from '../sim/format';
import type { Design } from '../sim/design';

/** What one toy costs and earns. Popularity is never shown here — that's revealed at launch. */
export function MoneyPanel({ design }: { design: Design }) {
  const cost = costToMake(design).total;
  const share = yourShare(design);
  const profit = profitPerToy(design);
  return (
    <section className="money" aria-label="Money for each toy">
      <div>
        <span className="money-label">🧵 Costs to make</span>
        <strong data-testid="cost">{formatMoney(cost)}</strong>
      </div>
      <div>
        <span className="money-label">🏪 You get (shop keeps half of {formatMoney(design.price)})</span>
        <strong>{formatMoney(share)}</strong>
      </div>
      <div className={profit < 0 ? 'loss' : 'gain'}>
        <span className="money-label">💰 Profit each</span>
        <strong data-testid="profit-each">{formatMoney(profit)}</strong>
      </div>
    </section>
  );
}
