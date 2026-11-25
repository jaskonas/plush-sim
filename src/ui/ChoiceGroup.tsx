import type { Entry } from '../sim/catalog/ids';

interface Props<Id extends string> {
  title: string;
  options: Record<Id, Entry<Id>>;
  value: Id;
  onChange: (id: Id) => void;
  /** Draw colour swatches instead of emoji. */
  swatches?: Record<Id, string>;
}

/** A row of big pick-one buttons, generated straight from a catalog table. */
export function ChoiceGroup<Id extends string>({ title, options, value, onChange, swatches }: Props<Id>) {
  return (
    <fieldset className="choice-group">
      <legend>{title}</legend>
      <div className={swatches ? 'choices swatches' : 'choices'}>
        {(Object.values(options) as Entry<Id>[]).map((o) => (
          <button
            key={o.id}
            type="button"
            className="choice"
            aria-pressed={o.id === value}
            title={o.kidNote}
            onClick={() => onChange(o.id)}
          >
            {swatches ? <span className="swatch" style={{ background: swatches[o.id] }} aria-hidden /> : <span aria-hidden>{o.emoji}</span>}
            <span className="choice-label">{o.label}</span>
          </button>
        ))}
      </div>
      <p className="choice-note">{options[value].kidNote}</p>
    </fieldset>
  );
}
