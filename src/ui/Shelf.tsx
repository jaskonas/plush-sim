import { useGame } from '../state/game';
import { ANIMALS } from '../sim/catalog/animals';
import { displayName } from '../sim/names';
import { formatMoney } from '../sim/format';
import { starsText } from './LaunchReport';

/** Every toy launched this session, so attempts can be compared. */
export function Shelf() {
  const shelf = useGame((s) => s.shelf);
  if (shelf.length === 0) return null;
  return (
    <nav className="shelf" aria-label="Your toy shelf">
      <span className="shelf-title">🗄️ Your shelf</span>
      <ol data-testid="shelf">
        {shelf.map((r, i) => (
          <li key={i} className={r.profit < 0 ? 'loss' : undefined}>
            <span aria-hidden>{ANIMALS[r.design.animal].emoji}</span>
            <span className="shelf-name">{displayName(r.design)}</span>
            <span className="shelf-stars">{starsText(r.stars)}</span>
            <strong>{formatMoney(r.profit)}</strong>
          </li>
        ))}
      </ol>
    </nav>
  );
}
