# Plush Studio — Design Spec

**Date:** 2026-11-24
**Status:** Draft for review
**Repo:** `plush-sim` (public, GitHub Pages), sibling of `skyscraper-sim`

## 1. Intent

A teaching game for the user's daughter, **age 10**, about the considerations that go into **designing and marketing a toy**. She picks a kind of stuffed animal and a style, makes design choices, sets the price and audience, launches it, and sees how **popular** and how **profitable** it was.

The lesson is **trade-offs**: almost every choice helps one thing and costs another (softer fabric → more popular but more expensive to make; buttons for eyes → cheap and cute but not allowed for babies; huge size → hugs but thin profit). There is no single right answer; the fun is finding a sweet spot and understanding *why* it worked.

**Success looks like:** she can explain, in her own words, why one of her toys sold better or earned more than another — naming cost, price, safety, and who the toy was for.

## 2. Goals, non-goals, anti-goals

**Goals**
- Headline scores are **Popularity** and **Profit**. Safety, softness and durability matter as *inputs* to those (unsafe for the chosen audience → can't launch; fragile → bad reviews).
- Results are **directionally correct** with plausible round numbers ("$4 to make, sells for $12"). Rules of thumb, not simulation.
- Every result is **explained**: who liked it, who didn't, and why, plus one tip for the biggest improvement.
- Reading level for a 10-year-old: short sentences, emoji-led cards, round numbers, no jargon or units beyond cm and $.
- Same spirit as Skyscraper Studio: each design stands alone, no unlocks or campaign.

**Non-goals (v1)**
- A selling season / time passing after launch (option "B" — possible later).
- Packaging design, advertising budget, competitors.
- Accounts, saving to a server, multiplayer, mobile/touch-first layout, LLM chat.

**Anti-goals** (would make it a failure even if it works)
- A **dominant strategy** — e.g. "cheapest everything + highest price always wins". Extreme corners must not be best.
- Results that feel **random or unexplained**.
- **Preachy** safety lectures, or scary/upsetting failure. A flop is a disappointing sales number with a friendly tip, nothing more.

## 3. Constraints

- Desktop browser. Runs locally with `npm run dev`; deployed to GitHub Pages on push to `master` (workflow copied from skyscraper-sim, tests must pass).
- No backend. Everything is static and client-side.
- Same stack as skyscraper-sim: **Vite + React 19 + TypeScript**, **react-three-fiber / drei / three** for 3D, **Zustand** for state, **Vitest + Testing Library** for tests.
- Deterministic: the same design (and same season trend) always gives the same result.

## 4. Approaches considered

1. **Procedural 3D plush from soft primitives** (spheres, capsules, extruded ear shapes) in react-three-fiber. Every choice reshapes/recolours live; she can orbit and "squish" it; fabric reads via material roughness/sheen. Shares code patterns with skyscraper-sim. **Chosen by the user**, who added: "with the ability to choose different animals and styles" — so animal and style are independent choices, and every animal must render in every style.
2. **Layered 2D SVG illustrations.** Easiest to make cute, but no turning the toy around, little shared with skyscraper-sim, and every animal/option needs new art.
3. **Hand-made or downloaded 3D models (GLB).** Best looking, but needs a model per variant, licence checks, and is hard to reshape per choice.

Launch-result shape (user's choice among three): **A — a single launch-day verdict.** Rejected: B (a selling season with month-by-month adjustments — bigger game) and C (a cast of shoppers reacting in speech bubbles as the core mechanic). A's report still shows a reaction line per shopper group, because explanation is a goal.

## 5. Game flow

1. **Start — "This year's toy market."** One card: the season's trend (e.g. "🔥 Hot colour: lavender · Hot animal: bunny · Hot style: round & squishy"), and the four shopper groups with a one-line description of what each wants. Button: **Design a toy**. The trend is picked from a small list when a new toy is started and stays fixed for that toy (and "try again").
2. **Design.** Center: the 3D plush, orbitable, gentle idle bob; clicking it plays a squish. Sidebar with two tabs:
   - **🧵 Design** — animal, style, fabric, stuffing, eyes, size, colour, accessory.
   - **🏷️ Marketing** — who it's for, price, name.
   - Always visible: **Cost to make** per toy, **Your share** of the shop price (shop keeps half), **Profit per toy**, and a **🧪 Safety lab** badge for the chosen audience.
   - **Popularity is *not* shown live** — real toy makers know their costs but have to guess demand. It is revealed at launch.
   - **Launch!** is disabled (with the reason) if the safety lab fails for the chosen audience.
3. **Sewing it up.** ~8–10 s animation (pieces appear, stitch together, stuffing puffs it out, eyes go on, tag sewn in). **Skip** button.
4. **Launch report** (sketch):
   ```
   🎉 LAUNCH DAY — "Biscuit the Bunny"
    ❤️ Popularity   ★★★★☆
    💰 Profit       $18,400   (4,600 sold × $5.10 each, minus $5,000 set-up)
    Makes for $3.80 · Sells for $12 · Shop keeps half
    👶 Toddler parents   😐 "Nice, but $12 is a lot for a baby toy"
    🧒 Kids 6–9          😍 "The floppy ears! In lavender!"
    🧑 Tweens            🙂 "Cute, kinda plain"
    🏆 Collectors        —  "Not aimed at us"
    💡 Tip: fleece instead of minky would add $0.60 profit on every toy
   ```
   Buttons: **Change it and try again** (back to Design, same trend, design kept) and **New toy** (back to Start, new trend).
5. **Toy shelf.** Launched toys from this session sit on a small shelf strip (name, animal emoji, stars, profit) so she can compare attempts. Memory only; cleared on reload.

## 6. Choices (v1 catalog)

All choices live in `src/sim/catalog/` as data with: id, label, emoji, kid-level one-liner, cost coefficients, and appeal/safety/durability effects with comments. Sidebar controls are generated from the catalog.

| Choice | Options | Trades off |
|---|---|---|
| Animal | bear, bunny, cat, puppy, elephant, dinosaur, unicorn, penguin, fox (≈8–9; more can be added as data) | base pattern pieces, fabric area, which groups love it, trend |
| Style | **Classic** (traditional teddy proportions, stitched nose, jointed-looking limbs), **Cute** (big head, small body, simple face), **Realistic** (true-to-life proportions, more pattern pieces, two-tone colouring), **Round & squishy** (marshmallow-shaped, ears/limbs reduced to nubs, few pieces) | proportions/silhouette; sewing cost (realistic most, round fewest); group appeal (collectors → classic/realistic, kids → cute, tweens → round & squishy, toddler parents → round/cute); can be a season trend |
| Fabric | minky, fleece, cotton, felt, faux fur | softness ↔ cost ↔ durability ↔ washability; faux fur sheds (not for babies) |
| Stuffing | fiberfill, recycled fiberfill, fiberfill + pellets | cost; recycled appeals to some parents; pellets = nice weight but **not for babies** |
| Eyes | embroidered, safety eyes, buttons | embroidered = baby-safe, a bit pricier, less sparkly; safety eyes OK 3+; buttons cheapest & cute but only for collectors |
| Size | small 20 cm, medium 35 cm, large 60 cm | fabric ∝ size², stuffing ∝ size³; big = huggable/wow but costly; small = pocket/collectible |
| Colour | ~8 swatches incl. natural browns, pastels, brights | trend colour boost; groups prefer different palettes |
| Accessory | none, bow, scarf | small cost + appeal to kids/tweens; bow is a small part → not for babies |
| Who it's for | babies (0–2), kids (3+), collectors (14+) | sets safety rules and which groups find it on the shelf |
| Price | $5–$40 in $1 steps | the big profit ↔ popularity lever |
| Name | free text + "ideas" | fun only, no score effect |

## 7. Economics model (`src/sim/market.ts`, pure)

All coefficients in one file (`src/sim/catalog/coefficients.ts`) with explanatory comments, like skyscraper-sim.

**Cost to make (per toy)** = fabric (area for animal × (size/35)² × waste factor × fabric $/m²) + stuffing (grams ∝ (size/35)³ × $/g) + eyes + accessory + sewing (pattern pieces × minutes per piece × factory rate) + tag/label. Style multiplies pattern pieces (e.g. round ×0.6, cute ×0.9, classic ×1.0, realistic ×1.5). Tuned so a medium classic bear in fleece costs ≈ $3–4, a large faux-fur elephant ≈ $12+.

**Shop split:** shop keeps half the price. **Profit per toy** = price/2 − cost to make. **Setup cost:** a fixed one-off (≈ $5,000) for the pattern and factory set-up, so a toy that barely sells **loses money** — a real lesson, shown gently.

**Demand.** Four shopper groups, each with a size (max buyers), price sensitivity, and tastes:

| Group | Wants | Price | Size |
|---|---|---|---|
| 👶 Toddler parents | baby-safe (hard requirement), soft, washable | medium-sensitive | large |
| 🧒 Kids 6–9 | favourite animals, bright/trend colours, accessories, big | very sensitive (parents pay) | largest |
| 🧑 Tweens | trend colour/animal, minky/faux fur, small-medium | medium | medium |
| 🏆 Collectors | quality fabric, buttons OK, durability, small size | barely sensitive | small |

**Who each audience reaches** *(Claude's call)*: the audience decides which shop aisle the toy sits in.

| Who it's for | Full reach (1.0) | Partial reach (~0.3, "different aisle") |
|---|---|---|
| Babies (0–2) | toddler parents | kids 6–9 (gift buyers) |
| Kids (3+) | kids 6–9, tweens | toddler parents, collectors |
| Collectors (14+) | collectors, tweens | kids 6–9 |

Toddler parents buy **nothing** from a toy that is not baby-safe, whatever the aisle; a baby-safe toy aimed at kids still reaches them at partial reach. Group sizes, price sensitivity and the collectors' willingness to pay are tuned so each audience has a top-tier design (balance tests below): kids (3+) wins on volume at low margins, collectors wins on margin at low volume, babies sits between with steady demand and few competitors for "safe + soft".

For each group: `appeal` (0–1) from tastes (animal, style, fabric, size, colour, accessory) + trend + durability; `reach` from the table above; `priceFactor` falls off smoothly above the group's comfortable price. **Units** = Σ size × appeal × reach × priceFactor, rounded to a friendly number. **Popularity stars** (1–5) come from total appeal-weighted reach, independent of price, so a great toy priced too high reads as "loved but too expensive" — the report says so.

**Safety lab** (`src/sim/safety.ts`): rules per audience. Babies: no buttons, safety eyes, pellets, faux fur, or bow. Kids: no buttons. Collectors: anything. Fail → Launch disabled with one-line reason; no lecture.

**Reactions:** each group gets a face (😍 🙂 😐 🙁 —) and a one-line reason picked from its strongest positive/negative factor.

**Tip** *(Claude's call)*: try every single change to fabric, stuffing, eyes, size, colour, accessory and price (±$1/±$2/±$5). Animal, style and audience are never suggested, because they change what the toy is, not fix it. Skip any change that fails the safety lab or **loses a popularity star**. Pick the biggest profit gain and phrase it as "X instead of Y would …". If no change raises profit, suggest the biggest popularity gain that doesn't lose money. If nothing helps either way, say what she got right. Tests check that tips don't all point the same way (e.g. not always "raise the price").

**Balance tests** guard the anti-goal: e.g. max price with cheapest parts is not the best profit; cheapest price is not the best profit; at least three clearly different designs (one per audience) land in the top tier.

## 8. Architecture

Mirrors skyscraper-sim:

```
src/sim/      catalog (animals, styles, fabrics, stuffing, eyes, sizes, colours, accessories, groups, trends, coefficients),
              cost.ts, safety.ts, market.ts (launch report), tip.ts — pure TS, unit-tested
src/state/    Zustand store: screen, trend, current design, shelf of launched toys
src/scene/    react-three-fiber: Plush (procedural from catalog shapes), fabric materials, Stage (lighting/backdrop),
              SewingAnimation
src/ui/       App, StartScreen, Sidebar (generated controls, cost readout, safety badge), LaunchReport, Shelf
```

- `launch(design, trend) → LaunchReport` is a pure function; the UI only renders it.
- Tests: unit tests for cost, safety, market, tip and balance; component tests for the sidebar and report with the 3D canvas mocked (jsdom has no WebGL).
- README in the same style as skyscraper-sim's: how to run, how to play, how to add an animal/fabric (data only).

## 9. Left to the builder

- Exact coefficient values (within the targets above), swatch colours, trend list, reaction wording, name ideas.
- 3D modelling details per animal and style (ear/tail/trunk/horn/spike geometry; styles as proportion transforms plus per-style part swaps), fabric material settings, the squish and sewing animations.
- Visual styling of the UI (warm, playful, readable; no specific brand look).
