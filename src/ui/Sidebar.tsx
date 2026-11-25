import { useState } from 'react';
import { useGame, NAME_MAX } from '../state/game';
import { ChoiceGroup } from './ChoiceGroup';
import { MoneyPanel } from './MoneyPanel';
import { SafetyBadge } from './SafetyBadge';
import { ANIMALS } from '../sim/catalog/animals';
import { STYLES } from '../sim/catalog/styles';
import { ACCESSORIES, COLOURS, EYES, FABRICS, SIZES, STUFFINGS } from '../sim/catalog/materials';
import { AUDIENCES } from '../sim/catalog/groups';
import { COLOUR_IDS, type ColourId } from '../sim/catalog/ids';
import { PRICE_MAX, PRICE_MIN } from '../sim/catalog/coefficients';
import { safetyCheck } from '../sim/safety';
import { nameIdeas } from '../sim/names';

const SWATCHES = Object.fromEntries(COLOUR_IDS.map((id) => [id, COLOURS[id].hex])) as Record<ColourId, string>;

type Tab = 'design' | 'marketing';

export function Sidebar() {
  const design = useGame((s) => s.design);
  const setDesign = useGame((s) => s.setDesign);
  const launch = useGame((s) => s.launch);
  const [tab, setTab] = useState<Tab>('design');
  const safe = safetyCheck(design).ok;

  return (
    <aside className="sidebar">
      <div role="tablist" className="tabs">
        <button role="tab" type="button" aria-selected={tab === 'design'} onClick={() => setTab('design')}>
          🧵 Design
        </button>
        <button role="tab" type="button" aria-selected={tab === 'marketing'} onClick={() => setTab('marketing')}>
          🏷️ Marketing
        </button>
      </div>

      <div className="tab-panel" role="tabpanel">
        {tab === 'design' ? (
          <>
            <ChoiceGroup title="Animal" options={ANIMALS} value={design.animal} onChange={(animal) => setDesign({ animal })} />
            <ChoiceGroup title="Style" options={STYLES} value={design.style} onChange={(style) => setDesign({ style })} />
            <ChoiceGroup title="Fabric" options={FABRICS} value={design.fabric} onChange={(fabric) => setDesign({ fabric })} />
            <ChoiceGroup title="Stuffing" options={STUFFINGS} value={design.stuffing} onChange={(stuffing) => setDesign({ stuffing })} />
            <ChoiceGroup title="Eyes" options={EYES} value={design.eyes} onChange={(eyes) => setDesign({ eyes })} />
            <ChoiceGroup title="Size" options={SIZES} value={design.size} onChange={(size) => setDesign({ size })} />
            <ChoiceGroup title="Colour" options={COLOURS} value={design.colour} onChange={(colour) => setDesign({ colour })} swatches={SWATCHES} />
            <ChoiceGroup title="Extra" options={ACCESSORIES} value={design.accessory} onChange={(accessory) => setDesign({ accessory })} />
          </>
        ) : (
          <>
            <ChoiceGroup title="Who it's for" options={AUDIENCES} value={design.audience} onChange={(audience) => setDesign({ audience })} />
            <fieldset className="choice-group">
              <legend>Price in the shop</legend>
              <div className="price-row">
                <input
                  type="range"
                  aria-label="Price"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={1}
                  value={design.price}
                  onChange={(e) => setDesign({ price: Number(e.target.value) })}
                />
                <strong className="price-value">${design.price}</strong>
              </div>
              <p className="choice-note">Higher prices earn more per toy — but fewer people buy.</p>
            </fieldset>
            <fieldset className="choice-group">
              <legend>Name</legend>
              <input
                className="name-box"
                type="text"
                aria-label="Name"
                maxLength={NAME_MAX}
                placeholder="Give it a name"
                value={design.name}
                onChange={(e) => setDesign({ name: e.target.value })}
              />
              <div className="name-ideas" data-testid="name-ideas">
                {nameIdeas(design).map((idea) => (
                  <button key={idea} type="button" className="chip" onClick={() => setDesign({ name: idea })}>
                    {idea}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <MoneyPanel design={design} />
        <SafetyBadge design={design} />
        <button type="button" className="launch" disabled={!safe} onClick={launch}>
          🚀 Launch!
        </button>
      </div>
    </aside>
  );
}
