import { create } from 'zustand';
import { DEFAULT_DESIGN, type Design, type Trend } from '../sim/design';
import { TRENDS } from '../sim/catalog/trends';
import { PRICE_MAX, PRICE_MIN } from '../sim/catalog/coefficients';
import { launch, type LaunchReport } from '../sim/market';
import { safetyCheck } from '../sim/safety';

export type Screen = 'start' | 'design' | 'sewing' | 'report';

export const NAME_MAX = 30;

interface GameState {
  screen: Screen;
  trend: Trend;
  design: Design;
  report: LaunchReport | null;
  /** Every toy launched this session, oldest first. */
  shelf: LaunchReport[];
  newToy: (rand?: () => number) => void;
  startDesigning: () => void;
  setDesign: (patch: Partial<Design>) => void;
  launch: () => void;
  finishSewing: () => void;
  tryAgain: () => void;
}

const pickTrend = (rand: () => number) => TRENDS[Math.min(TRENDS.length - 1, Math.floor(rand() * TRENDS.length))];

export const useGame = create<GameState>()((set, get) => ({
  screen: 'start',
  trend: TRENDS[0],
  design: DEFAULT_DESIGN,
  report: null,
  shelf: [],

  newToy: (rand = Math.random) => set({ screen: 'start', trend: pickTrend(rand), design: DEFAULT_DESIGN, report: null }),

  startDesigning: () => set({ screen: 'design' }),

  setDesign: (patch) => {
    const next = { ...get().design, ...patch };
    next.price = Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(next.price)));
    next.name = next.name.slice(0, NAME_MAX);
    set({ design: next });
  },

  launch: () => {
    const { design, trend, shelf } = get();
    if (!safetyCheck(design).ok) return;
    const report = launch(design, trend);
    set({ report, shelf: [...shelf, report], screen: 'sewing' });
  },

  finishSewing: () => set({ screen: 'report' }),

  tryAgain: () => set({ screen: 'design' }),
}));
