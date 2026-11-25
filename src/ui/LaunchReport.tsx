import { useMemo } from 'react';
import { useGame } from '../state/game';
import { GROUPS } from '../sim/catalog/groups';
import { formatMoney } from '../sim/format';
import { displayName } from '../sim/names';
import { findTip } from '../sim/tip';
import type { LaunchReport as Report } from '../sim/market';

export const starsText = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function LaunchReport({ report }: { report: Report }) {
  const tryAgain = useGame((s) => s.tryAgain);
  const newToy = useGame((s) => s.newToy);
  const tip = useMemo(() => findTip(report.design, report.trend), [report]);
  const lost = report.profit < 0;

  return (
    <section className="card report" aria-label="Launch report">
      <p className="report-kicker">🎉 Launch day</p>
      <h2>{displayName(report.design)}</h2>

      <div className="headline">
        <div>
          <span className="headline-label">❤️ Popularity</span>
          <span className="stars" data-testid="stars" aria-label={`${report.stars} out of 5 stars`}>
            {starsText(report.stars)}
          </span>
        </div>
        <div className={lost ? 'loss' : 'gain'}>
          <span className="headline-label">{lost ? '💸 Lost money' : '💰 Profit'}</span>
          <strong className="profit" data-testid="profit">
            {formatMoney(report.profit)}
          </strong>
        </div>
      </div>
      <p className="sums" data-testid="sums">
        {report.profitPerToy >= 0 ? (
          <>
            {report.units.toLocaleString('en-US')} sold × {formatMoney(report.profitPerToy)} each, minus {formatMoney(report.setupCost)} to set up the
            factory
          </>
        ) : (
          <>
            Each toy cost {formatMoney(report.cost)} to make, but you only got {formatMoney(report.price / 2)} — so you lost{' '}
            {formatMoney(-report.profitPerToy)} on every one of the {report.units.toLocaleString('en-US')} sold, plus {formatMoney(report.setupCost)} to
            set up the factory.
          </>
        )}
      </p>
      <p className="sums">
        Makes for {formatMoney(report.cost)} · Sells for ${report.price} · Shop keeps half
      </p>

      <ul className="reactions" data-testid="groups">
        {report.groups.map((g) => (
          <li key={g.group} className={g.face === '—' ? 'muted' : undefined}>
            <span aria-hidden>{GROUPS[g.group].emoji}</span>
            <strong>{GROUPS[g.group].label}</strong>
            <span className="face" aria-hidden>
              {g.face}
            </span>
            <span className="line">“{g.line}”</span>
          </li>
        ))}
      </ul>

      <p className="tip" data-testid="tip">
        💡 {tip.text}
      </p>

      <div className="report-buttons">
        <button type="button" className="big" onClick={tryAgain}>
          🔧 Change it and try again
        </button>
        <button type="button" className="secondary" onClick={() => newToy()}>
          ✨ New toy
        </button>
      </div>
    </section>
  );
}
