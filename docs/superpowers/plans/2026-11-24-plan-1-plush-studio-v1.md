# Plush Studio v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A playable browser game where a 10-year-old designs a stuffed animal (animal, style, materials, price, audience, name), launches it, and gets a launch-day report on popularity and profit.

**Architecture:** Pure-TS sim (`src/sim/`: catalog data + `costToMake`, `safetyCheck`, `launch`, `findTip`) drives everything; a Zustand store (`src/state/`) holds screen/trend/design/shelf; react-three-fiber (`src/scene/`) renders a procedural plush from `plushParts()`; React UI (`src/ui/`) generates controls from the catalog. Mirrors jaskonas/skyscraper-sim.

**Tech Stack:** Vite 8, React 19, TypeScript 5.9 (strict), three 0.186 + @react-three/fiber 9 + drei 10, Zustand 5, Vitest 5 + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-11-24-plush-studio-design.md`

## Global Constraints

- Audience: a 10-year-old. Copy is short sentences, emoji-led, round numbers; only units are cm and $.
- Deterministic: same `Design` + `Trend` → identical `LaunchReport`. No `Math.random` in `src/sim/` (randomness only in the store's `newToy`, injectable).
- Shop keeps half the price. Setup cost ≈ $5,000 per launch, subtracted from profit.
- Price $5–$40 in $1 steps. Sizes 20 / 35 / 60 cm.
- Popularity is never shown before launch.
- Launch is disabled (with a one-line reason) when the safety lab fails for the chosen audience. No lectures, no recall drama.
- Tip never suggests changing animal, style or audience, never loses a star, never fails safety.
- Animal and style are independent; every animal renders in every style.
- Desktop browser, no backend; GitHub Pages deploy from `master` via `.github/workflows/pages.yml` (already copied; runs `npm test` and `npm run build`).
- All tuning numbers live in `src/sim/catalog/coefficients.ts` (or the catalog entry they describe) with a comment.

## Review Focus

- **Empty, long or emoji names** → report/shelf title falls back to "Your Bunny" when blank; names are capped at 30 characters in the input. Test in Task 9.
- **Switching audience after picking unsafe parts** (buttons chosen, then audience → babies) → the Launch button disables at once and the badge names the part. Test in Task 9.
- **Negative profit** → shown as "−$3,200" in red-ish "lost money" styling, never "$-3200". `formatMoney` test in Task 4.
- **Price at the bounds ($5, $40)** → cost/profit readouts and the report stay sane (no NaN, units ≥ 0). Test in Task 4.
- **Try again vs New toy** → Try again keeps the design and trend; New toy resets the design and picks a trend; the shelf keeps all launches either way. Test in Task 7.

---

### Task 1: Project skeleton on GitHub

**Files:**
- Create: `src/ui/App.tsx` (placeholder heading "Plush Studio"), `src/ui/styles.css`, `src/ui/App.test.tsx`, `README.md` (stub: title + `npm install && npm run dev`)
- Existing (keep): `package.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `public/*`, `src/main.tsx`, `src/test/setup.ts`, `.github/workflows/pages.yml`, spec, this plan

- [ ] **Step 1: Write the failing test** — `App.test.tsx`: `render(<App />)`; `expect(screen.getByRole('heading', { name: /plush studio/i })).toBeInTheDocument()`.
- [ ] **Step 2: Run** `npm test` — Expected: FAIL (cannot resolve `./App`).
- [ ] **Step 3: Implement** `export function App(): JSX.Element` returning `<h1>Plush Studio</h1>`; `styles.css` sets a warm background `#fbf4ee`, system font, `margin: 0`.
- [ ] **Step 4: Verify** `npm test && npm run typecheck && npm run build` — all pass, `dist/index.html` exists.
- [ ] **Step 5: Commit and publish**

```bash
git add -A && git commit -m "chore: scaffold Plush Studio (Vite + React + R3F), spec and plan"
gh repo create jaskonas/plush-sim --public --description "Plush Studio — a teaching game about designing and selling a stuffed animal" --source . --push
gh api -X POST repos/jaskonas/plush-sim/pages -f build_type=workflow
gh run watch --exit-status $(gh run list -L1 --json databaseId -q '.[0].databaseId')
```
Expected: run succeeds; `https://jaskonas.github.io/plush-sim/` shows the heading.

---

### Task 2: Catalog and design types

**Files:**
- Create: `src/sim/catalog/ids.ts`, `animals.ts`, `styles.ts`, `materials.ts` (fabrics, stuffings, eyes, sizes, colours, accessories), `groups.ts`, `trends.ts`, `coefficients.ts`; `src/sim/design.ts`
- Test: `src/sim/catalog/catalog.test.ts`

**Interfaces:**
- Produces (in `ids.ts`, each `as const` tuple + union type):
  `ANIMAL_IDS = ['bear','bunny','cat','puppy','elephant','dinosaur','unicorn','penguin','fox']` → `AnimalId`;
  `STYLE_IDS = ['classic','cute','realistic','round']` → `StyleId`;
  `FABRIC_IDS = ['minky','fleece','cotton','felt','fauxFur']`; `STUFFING_IDS = ['fiberfill','recycled','pellets']`; `EYES_IDS = ['embroidered','safety','buttons']`; `SIZE_IDS = ['small','medium','large']`; `COLOUR_IDS` (8: `'honey','chocolate','cream','lavender','blush','mint','sky','sunshine'`); `ACCESSORY_IDS = ['none','bow','scarf']`; `AUDIENCE_IDS = ['babies','kids','collectors']`; `GROUP_IDS = ['toddlerParents','kids','tweens','collectors']`.
- Every catalog entry: `{ id, label: string, emoji: string, kidNote: string }` plus its own numbers:
  - `Animal`: `basePieces: number`, `surface: number` (m² at 35 cm), `shape: AnimalShape` where `AnimalShape = { ears: { kind: 'round'|'long'|'pointy'|'floppy'|'flap'; size: number }; snout: number; tail: 'none'|'pom'|'long'|'stub'|'spiky'; extras: Array<'trunk'|'horn'|'mane'|'spikes'|'beak'|'wings'|'bellyPatch'> }` (unicorn: horn+mane, elephant: trunk, dinosaur: spikes, penguin: beak+wings+bellyPatch), `fans: Partial<Record<GroupId, number>>` (−0.2…+0.2 appeal).
  - `Style`: `pieceFactor` (round 0.6, cute 0.9, classic 1.0, realistic 1.5), `proportions: { head: number; body: [number,number,number]; limb: number; earScale: number }`, `fans`.
  - `Fabric`: `costPerM2`, `softness` (0–1), `durability` (0–1), `sheds: boolean`, `washable: boolean`, `fans`, `look: { roughness: number; sheen: number; fuzz: number }`.
  - `Stuffing`: `costPerGram`, `fans`. `Eyes`: `cost`, `sparkle` (0–1), `fans`. `Size`: `cm` (20/35/60), `fans`. `Colour`: `hex`, `palette: 'natural'|'pastel'|'bright'`. `Accessory`: `cost`, `smallPart: boolean`, `fans`.
- `src/sim/design.ts`: `interface Design { animal; style; fabric; stuffing; eyes; size; colour; accessory; audience: AudienceId; price: number; name: string }`, `interface Trend { animal: AnimalId; style: StyleId; colour: ColourId }`, `DEFAULT_DESIGN: Design` (bear, classic, fleece, fiberfill, embroidered, medium, honey, none, kids, $14, '').
- `TRENDS: Trend[]` (≥ 6 entries) in `trends.ts`.

- [ ] **Step 1: Write the failing tests** — for every id list: a catalog entry exists with matching `id`, non-empty `label`, `emoji`, `kidNote`; `kidNote.length <= 90` (short for a 10-year-old); `SIZES.medium.cm === 35`; `STYLES.realistic.pieceFactor > STYLES.classic.pieceFactor > STYLES.round.pieceFactor`; every `TRENDS` entry uses valid ids; `DEFAULT_DESIGN.price` is within 5–40.
- [ ] **Step 2: Run** `npx vitest run src/sim/catalog` — FAIL (modules missing).
- [ ] **Step 3: Implement** the catalog files above. Records are `Record<XId, X>` so a missing entry is a type error.
- [ ] **Step 4: Run** `npx vitest run src/sim/catalog && npm run typecheck` — PASS.
- [ ] **Step 5: Commit** `feat(sim): toy catalog — animals, styles, materials, shopper groups, trends`

---

### Task 3: Cost to make and safety lab

**Files:** Create `src/sim/cost.ts`, `src/sim/safety.ts`; Test `src/sim/cost.test.ts`, `src/sim/safety.test.ts`

**Interfaces:**
- Consumes: catalog, `Design`.
- Produces:
  - `interface CostBreakdown { fabric: number; stuffing: number; eyes: number; accessory: number; sewing: number; tag: number; total: number }` (dollars, 2-dp).
  - `costToMake(d: Design): CostBreakdown` — fabric = `animal.surface × (cm/35)² × WASTE × fabric.costPerM2`; stuffing grams = `STUFFING_GRAMS_AT_35 × (cm/35)³`; sewing = `round(animal.basePieces × style.pieceFactor) × MINUTES_PER_PIECE × FACTORY_RATE_PER_MIN`.
  - `yourShare(d): number` = `d.price × SHOP_SHARE` (`SHOP_SHARE = 0.5`); `profitPerToy(d): number` = `yourShare(d) − costToMake(d).total`.
  - `interface SafetyResult { ok: boolean; problems: string[] }`; `safetyCheck(d: Design): SafetyResult`.
- Rules: babies forbid `buttons`, `safety` eyes, `pellets`, `fauxFur`, any `smallPart` accessory; kids forbid `buttons`; collectors allow all. Problem copy, e.g. `"Buttons could come off — not safe for babies"`.

- [ ] **Step 1: Write the failing tests**

```ts
it('medium classic fleece bear costs $3–4', () => { const c = costToMake(DEFAULT_DESIGN).total; expect(c).toBeGreaterThanOrEqual(3); expect(c).toBeLessThanOrEqual(4); });
it('large realistic faux-fur elephant costs at least $12', () => expect(costToMake({ ...DEFAULT_DESIGN, animal: 'elephant', style: 'realistic', fabric: 'fauxFur', size: 'large' }).total).toBeGreaterThanOrEqual(12));
it('round style is cheaper to sew than realistic', ...)  // sewing component only
it('large costs more than medium costs more than small', ...)
it('profitPerToy is half the price minus cost', () => expect(profitPerToy({ ...DEFAULT_DESIGN, price: 20 })).toBeCloseTo(10 - costToMake(DEFAULT_DESIGN).total));
it('buttons fail for babies and kids, pass for collectors', ...)  // problems[0] matches /button/i
it('a fully embroidered fleece fiberfill toy passes for babies', ...)
it('babies + pellets + bow lists two problems', ...)
```
- [ ] **Step 2: Run** `npx vitest run src/sim/cost src/sim/safety` — FAIL.
- [ ] **Step 3: Implement** both modules; constants `WASTE`, `STUFFING_GRAMS_AT_35`, `MINUTES_PER_PIECE`, `FACTORY_RATE_PER_MIN`, `TAG_COST`, `SHOP_SHARE`, `SETUP_COST = 5000` go in `coefficients.ts`; tune catalog prices until the two cost targets pass.
- [ ] **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `feat(sim): cost to make, profit per toy, safety lab`

---

### Task 4: Market and launch report

**Files:** Create `src/sim/market.ts`, `src/sim/format.ts`; Test `src/sim/market.test.ts`, `src/sim/format.test.ts`

**Interfaces:**
- Consumes: catalog, `costToMake`, `profitPerToy`, `safetyCheck`, `SETUP_COST`.
- Produces:
  - `REACH: Record<AudienceId, Partial<Record<GroupId, number>>>` = babies `{toddlerParents:1, kids:0.3}`, kids `{kids:1, tweens:1, toddlerParents:0.3, collectors:0.3}`, collectors `{collectors:1, tweens:1, kids:0.3}`; missing = 0.
  - `type Face = '😍'|'🙂'|'😐'|'🙁'|'—'`
  - `interface GroupResult { group: GroupId; reach: number; appeal: number; priceFactor: number; units: number; face: Face; line: string }`
  - `interface LaunchReport { design: Design; trend: Trend; stars: 1|2|3|4|5; units: number; cost: number; price: number; profitPerToy: number; setupCost: number; profit: number; groups: GroupResult[] }`
  - `appealFor(group: GroupId, d: Design, t: Trend): number` (0–1): base 0.4 + sum of `fans[group]` across chosen entries + trend bonus (+0.1 each for matching animal/style/colour) + fabric softness/durability weights per group (in `groups.ts`) ; clamp 0–1. Toddler parents: 0 if `!safetyCheck({ ...d, audience: 'babies' }).ok`.
  - `priceFactor(group, price): number` = 1 if `price ≤ comfyPrice`, else `exp(−sensitivity × (price − comfyPrice) / comfyPrice)`. Starting values in `groups.ts`: size toddlerParents 30 000, kids 40 000, tweens 20 000, collectors 6 000; comfyPrice 14 / 12 / 16 / 35; sensitivity 1.2 / 2.0 / 1.2 / 0.3 (Task 6 may retune).
  - `launch(d: Design, t: Trend): LaunchReport` — units per group = `size × appeal × reach × priceFactor`, total rounded to nearest 100; `profit = units × profitPerToy − SETUP_COST`; popularity score = Σ(size·appeal·reach) / Σ(size·reach), `stars = clamp(ceil(score × 5), 1, 5)` (price-independent).
  - Face: reach 0 → `'—'` with line "Not aimed at us"; else appeal ≥ 0.75 😍, ≥ 0.55 🙂, ≥ 0.35 😐, else 🙁. Line names the strongest factor; if `priceFactor < 0.5` the line is about price (e.g. "Love it, but $30 is a lot").
  - `formatMoney(n: number): string` → `"$18,400"`, `"−$3,200"` (U+2212), `"$3.80"` for |n| < 100.
- [ ] **Step 1: Write the failing tests**

```ts
it('is deterministic', () => expect(launch(d, t)).toEqual(launch(d, t)));
it('toddler parents buy nothing from a toy with buttons', () => expect(group(launch({ ...d, eyes: 'buttons', audience: 'collectors' }, t), 'toddlerParents').units).toBe(0));
it('collectors aisle does not reach toddler parents', () => expect(group(launch({ ...d, audience: 'collectors' }, t), 'toddlerParents').face).toBe('—'));
it('raising the price never raises units', ...)       // price 10 vs 30
it('stars do not depend on price', ...)               // price 8 vs 38 same stars
it('matching the trend raises stars or units', ...)
it('profit = units × profitPerToy − 5000', ...)
it('price at $5 and $40 gives finite numbers and units ≥ 0', ...)   // Review Focus
it('formatMoney', () => { expect(formatMoney(18400)).toBe('$18,400'); expect(formatMoney(-3200)).toBe('−$3,200'); expect(formatMoney(3.8)).toBe('$3.80'); });
```
- [ ] **Step 2: Run** `npx vitest run src/sim/market src/sim/format` — FAIL.
- [ ] **Step 3: Implement** as specified; group taste weights and reaction lines live in `groups.ts`.
- [ ] **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `feat(sim): shopper groups, launch report, money formatting`

---

### Task 5: Tip and name ideas

**Files:** Create `src/sim/tip.ts`, `src/sim/names.ts`; Test `src/sim/tip.test.ts`, `src/sim/names.test.ts`

**Interfaces:**
- Produces:
  - `interface Tip { kind: 'profit'|'popularity'|'praise'; text: string; change?: Partial<Design> }`
  - `findTip(d: Design, t: Trend): Tip` — candidates: every other option of `fabric, stuffing, eyes, size, colour, accessory`, and `price` ±1/±2/±5 within 5–40. Drop candidates that fail `safetyCheck` or lower `stars`. Pick max profit gain (> $0) → `kind 'profit'`, text "`<new label>` instead of `<old label>` would add `<formatMoney(gain)>` profit" (price: "Selling for $X instead of $Y would…"). Else max stars/units gain with profit ≥ current → `'popularity'`. Else `'praise'` naming the best-scoring group ("Kids 6–9 loved it — nice work!").
  - `nameIdeas(d: Design): string[]` — 4 deterministic ideas from animal + colour word lists (e.g. "Biscuit the Bunny").
  - `displayName(d: Design): string` — trimmed name, or "Your <animal label>" when blank.
- [ ] **Step 1: Write the failing tests** — tip never changes `animal|style|audience`; applying `tip.change` keeps `safetyCheck().ok` and does not lower `stars`; for `kind 'profit'`, `launch({...d, ...change}).profit > launch(d).profit`; across 30 varied designs (a fixed list built from catalog ids), the tips are not all price changes and not all "raise price"; `nameIdeas` returns 4 distinct non-empty strings ≤ 30 chars; `displayName({...d, name: '   '})` is `'Your Teddy bear'` (or the bear's label).
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `feat(sim): launch tips and name ideas`

---

### Task 6: Balance

**Files:** Create `src/sim/balance.test.ts`, `src/sim/search.ts` (test helper, also usable by dev tools); Modify: `src/sim/catalog/*.ts`, `groups.ts`, `coefficients.ts` (tuning only)

**Interfaces:**
- Produces: `bestDesign(t: Trend, fixed: Partial<Design>): Design` — greedy coordinate ascent on profit over the same option set as the tip plus animal/style, starting from `DEFAULT_DESIGN` and two other fixed seeds, keeping only `safetyCheck` passes; returns the best.
- [ ] **Step 1: Write the failing tests** (for every `TRENDS` entry):
  - "cheapest parts + $40" profit < `bestDesign` profit × 0.6.
  - "cheapest parts + $5" profit < 0 or < `bestDesign` × 0.3.
  - for each audience, `bestDesign(t, { audience })` profit ≥ 0.6 × the overall best (each audience can win).
  - the best kids design sells more units than the best collectors design; the best collectors design has higher `profitPerToy`.
  - at least 3 animals and 2 styles appear among the per-audience/per-trend bests.
- [ ] **Step 2: Run** `npx vitest run src/sim/balance` — expect some FAIL.
- [ ] **Step 3: Tune** coefficients (not formulas) until all pass; keep Task 3–5 tests green.
- [ ] **Step 4: Run** `npm test` — all PASS.
- [ ] **Step 5: Commit** `test(sim): balance guards against a dominant strategy; tune coefficients`

---

### Task 7: Game store

**Files:** Create `src/state/game.ts`; Test `src/state/game.test.ts`

**Interfaces:**
- Produces: `useGame` (Zustand) with state `{ screen: 'start'|'design'|'sewing'|'report'; trend: Trend; design: Design; report: LaunchReport | null; shelf: LaunchReport[] }` and actions `newToy(rand?: () => number)` (picks `TRENDS[floor(rand()*len)]`, resets design to `DEFAULT_DESIGN`, screen `'start'`), `startDesigning()`, `setDesign(patch: Partial<Design>)` (clamps price to 5–40 integers, name to 30 chars), `launch()` (no-op unless `safetyCheck(design).ok`; sets `report`, pushes to `shelf`, screen `'sewing'`), `finishSewing()` (→ `'report'`), `tryAgain()` (→ `'design'`, keeps design + trend).
- [ ] **Step 1: Write the failing tests** — `launch()` with buttons + babies leaves screen `'design'` and shelf empty; launch → sewing → report flow; `tryAgain` keeps design and trend; `newToy(() => 0)` sets `TRENDS[0]` and default design but keeps the shelf (Review Focus); `setDesign({ price: 99 })` → 40, `{ price: 7.6 }` → 8; `setDesign({ name: 'x'.repeat(50) })` → 30 chars.
- [ ] **Step 2–4:** run FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(state): game store`

---

### Task 8: The 3D plush

**Files:** Create `src/scene/plushParts.ts`, `src/scene/fabricMaterial.ts`, `src/scene/Plush.tsx`, `src/scene/Stage.tsx`; Test `src/scene/plushParts.test.ts`, `src/scene/fabricMaterial.test.ts`

**Interfaces:**
- Consumes: `ANIMALS[*].shape: AnimalShape` and `STYLES[*].proportions` (Task 2).
- Produces:
  - `interface Part { id: string; shape: 'sphere'|'capsule'|'cone'|'disc'|'torus'; position: [number,number,number]; scale: [number,number,number]; rotation?: [number,number,number]; role: 'main'|'accent'|'eye'|'nose'|'accessory' }`
  - `plushParts(d: Pick<Design,'animal'|'style'|'size'|'eyes'|'accessory'>): Part[]` — unit-height model (size scales the group, not the parts); mirrored ears/limbs; `role 'accent'` for belly/inner ear/snout (realistic style uses accent more widely for two-tone).
  - `fabricMaterial(f: FabricId): { roughness: number; sheen: number; sheenRoughness: number }` from `FABRICS[f].look`.
  - `<Plush design={Design} />` renders parts with `meshPhysicalMaterial` (main colour from `COLOURS`, accent = lightened main), gentle idle bob, click → squish (scale y 0.85 → 1 spring over ~300 ms). Eyes: embroidered → flat dark `disc`; safety → glossy black sphere; buttons → disc with `torus` rim.
  - `<Stage>` — `<Canvas>` with soft key/fill lights, round floor disc with contact shadow (drei `ContactShadows`), `OrbitControls` (no pan, zoom limited), children.
- [ ] **Step 1: Write the failing tests** — for every animal × style: has exactly one `head` and one `body`, two parts with `role 'eye'`, all scales positive and finite, all parts within a 1.6-unit box; `round` style limb parts are shorter than `classic`; unicorn has a `horn`, elephant a `trunk`, dinosaur `spikes`, penguin `beak`; `eyes: 'buttons'` yields `torus` parts; `accessory: 'scarf'` yields an `accessory` part; `fabricMaterial('fauxFur').sheen > fabricMaterial('cotton').sheen`.
- [ ] **Step 2–4:** run FAIL → implement → PASS.
- [ ] **Step 5: Manual check** `npm run dev` — every animal in every style looks like itself and toys look soft; switching options updates instantly. Screenshot or note any that read badly and fix shapes.
- [ ] **Step 6: Commit** `feat(scene): procedural plush for every animal and style`

---

### Task 9: Start and design screens

**Files:** Create `src/ui/StartScreen.tsx`, `src/ui/Sidebar.tsx`, `src/ui/ChoiceGroup.tsx`, `src/ui/MoneyPanel.tsx`, `src/ui/SafetyBadge.tsx`; Modify `src/ui/App.tsx`, `styles.css`; Test `src/ui/Sidebar.test.tsx`, `src/ui/StartScreen.test.tsx`

**Interfaces:**
- Consumes: `useGame`, catalog, `costToMake`, `yourShare`, `profitPerToy`, `safetyCheck`, `nameIdeas`, `formatMoney`, `<Stage>`/`<Plush>`.
- Produces: `App` switches on `screen` (`'start'` → StartScreen; `'design'` → Stage+Plush beside Sidebar; `'sewing'`/`'report'` filled by Tasks 10–11).
  - StartScreen: "This year's toy market" card with trend line ("🔥 Hot colour: Lavender · Hot animal: Bunny · Hot style: Round & squishy") and the four groups' one-liners; button **Design a toy**.
  - Sidebar tabs **🧵 Design** (animal, style, fabric, stuffing, eyes, size, colour swatches, accessory) and **🏷️ Marketing** (Who it's for, price slider $5–$40 step 1, name input `maxLength=30` + 4 idea chips). `ChoiceGroup` renders any catalog record as emoji+label buttons with `aria-pressed`, `kidNote` as `title`.
  - MoneyPanel (always visible): Cost to make, Your share (shop keeps half), Profit per toy. **No popularity anywhere.**
  - SafetyBadge: "🧪 Safety lab: passed for kids" or "🧪 Fix first: <problem>". **Launch!** button `disabled` when failing, with the problem as visible text.
- [ ] **Step 1: Write the failing tests** (mock `../scene/Stage` and `../scene/Plush` with `vi.mock` returning `null`; jsdom has no WebGL):
  - clicking "🐰 Bunny" sets `design.animal` to `'bunny'`;
  - choosing Buttons then audience Babies disables **Launch!** and shows /button/i (Review Focus);
  - money panel updates when Large is chosen;
  - `queryByText(/popular|★/i)` is null on the design screen;
  - name input truncates at 30; clicking an idea chip fills the name (Review Focus);
  - StartScreen shows the trend's colour label and the Design a toy button moves to `'design'`.
- [ ] **Step 2–4:** run FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(ui): start screen and design sidebar`

---

### Task 10: Sewing animation

**Files:** Create `src/scene/sewing.ts`, `src/ui/SewingScreen.tsx`; Modify `src/scene/Plush.tsx` (accept `reveal?: SewingStage`); Test `src/scene/sewing.test.ts`, `src/ui/SewingScreen.test.tsx`

**Interfaces:**
- Produces: `type SewingStage = 'pieces'|'stitch'|'stuff'|'eyes'|'tag'|'done'`; `SEWING_SECONDS = 9`; `sewingStage(t: number): SewingStage` (equal fifths, `'done'` at ≥ 9 s); `sewingCaption(s): string` ("✂️ Cutting the pieces", "🧵 Stitching", "☁️ Stuffing", "👀 Adding the eyes", "🏷️ Sewing in the tag"). Plush with `reveal`: pieces = flat (scale z 0.05) and spread apart; stitch = gathered; stuff = scale tween from 0.6 → 1; eyes appear at `'eyes'`; done = normal.
  - SewingScreen: Stage+Plush(reveal), caption, **Skip** → `finishSewing()`; calls `finishSewing()` when `'done'`.
- [ ] **Step 1: Tests** — `sewingStage(0)==='pieces'`, `(8.99)==='tag'`, `(9)==='done'`, monotonic over 0..9; SewingScreen Skip moves store to `'report'`.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `feat: sewing-it-up animation`

---

### Task 11: Launch report and shelf

**Files:** Create `src/ui/LaunchReport.tsx`, `src/ui/Shelf.tsx`; Modify `App.tsx`; Test `src/ui/LaunchReport.test.tsx`

**Interfaces:**
- Consumes: `LaunchReport`, `findTip`, `displayName`, `formatMoney`, `useGame`.
- Produces: report card matching the spec sketch — title "🎉 LAUNCH DAY — <displayName>", ❤️ stars (★/☆), 💰 profit with "(units sold × profit each, minus $5,000 set-up)", "Makes for $X · Sells for $Y · Shop keeps half", one row per group (emoji, name, face, line), 💡 tip text; negative profit styled as "lost money" with `formatMoney` (Review Focus); buttons **Change it and try again** (`tryAgain`) and **New toy** (`newToy()`). Plush shown beside it (static). `Shelf`: strip on design and report screens listing shelf items (animal emoji, displayName, stars, profit); hidden when empty.
- [ ] **Step 1: Tests** — renders stars count equal to `report.stars`; shows all four group rows; blank name shows "Your Teddy bear"; a loss shows "−$" text; Try again returns to design with same design; shelf shows one entry after one launch and two after try-again + relaunch.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `feat(ui): launch report and toy shelf`

---

### Task 12: README, polish and deploy

**Files:** Modify `README.md`, `styles.css`

- [ ] **Step 1:** README in skyscraper-sim's voice: what it is, Run it, How to play (market → design → marketing → launch → report → try again), Develop (`npm test`, `npm run typecheck`, `npm run build`), "All money and taste numbers live in `src/sim/catalog/`", and **Adding an animal, style or fabric** (add id to `ids.ts`, entry in the catalog file, shape in `animals.ts`; catalog-wide tests and the sidebar pick it up).
- [ ] **Step 2: Verify** `npm test && npm run typecheck && npm run build` — all pass.
- [ ] **Step 3: Play-through** with `npm run dev`: one toy per audience; confirm a flop loses money gently, the tip makes sense, every animal/style renders.
- [ ] **Step 4: Commit and push** `docs: README; polish` → `git push`; `gh run watch` succeeds; the live Pages URL plays end to end.
