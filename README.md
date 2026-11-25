# Plush Studio

A teaching game about designing and selling a stuffed animal. Pick an animal and a style, choose what it's made of, set a price and who it's for, then launch it and see how popular it was — and whether it made money.

Play it at **https://www.jaskonas.com/plush-sim/**.

## Run it

    npm install
    npm run dev

Then open the printed `http://localhost:5173` link.

## How to play

1. **This year's toy market.** Every new toy starts with a market card: this season's hot colour, animal and style, and the four kinds of shoppers — 👶 toddler parents, 🧒 kids 6–9, 🧑 tweens and 🏆 collectors — and what each of them wants.
2. **🧵 Design.** Choose the animal (bear, bunny, cat, puppy, elephant, dinosaur, unicorn, penguin or fox) and its style (Classic, Cute, Realistic or Round & squishy), then the fabric, stuffing, eyes, size, colour and an extra. The toy changes in 3D as you go — drag to turn it, tap it for a squish.
3. **🏷️ Marketing.** Decide who it's for (babies, kids or collectors), set the shop price ($5–$40) and give it a name.
4. While you design you always see what one toy **costs to make**, what **you get** (the shop keeps half the price) and the **profit on each toy**. The **🧪 safety lab** checks the toy for the audience you chose — buttons, plastic eyes, pellets, faux fur and bows aren't allowed for babies, and buttons aren't allowed for kids. You can't launch until it passes.
5. **🚀 Launch!** Watch it get sewn up, then read the launch report: ❤️ popularity stars, 💰 profit, what each group of shoppers thought, and a 💡 tip for the one change that would have helped most.
6. **Change it and try again** keeps your design and the season; **New toy** starts a new season. Everything you launch goes on **🗄️ your shelf** at the top, so you can compare.

Popularity stays hidden until launch day — real toy makers know their costs, but they have to guess what people will love.

## Develop

    npm test          # unit and component tests
    npm run typecheck
    npm run build

Open the game with `?gallery` to see every animal in every style side by side.

All the money and taste numbers live in `src/sim/catalog/` — costs in `coefficients.ts` and `materials.ts`, shopper groups in `groups.ts`, and which shoppers each aisle reaches in `src/sim/market.ts`. `src/sim/balance.test.ts` checks that no single trick (like the cheapest parts at the highest price) always wins and that every audience can produce a winning toy; run it after changing any numbers.

## Adding an animal, style or fabric

Everything is data:

- **Animal:** add an id to `ANIMAL_IDS` in `src/sim/catalog/ids.ts`, then an entry in `src/sim/catalog/animals.ts` — pattern pieces, fabric area, which shoppers love it, and its shape (ears, snout, tail and extras like a horn or trunk).
- **Style:** add to `STYLE_IDS`, then `src/sim/catalog/styles.ts` — how many pattern pieces it takes, its proportions, and its fans.
- **Fabric, stuffing, eyes, size, colour or extra:** add to the id list, then `src/sim/catalog/materials.ts`.

The sidebar, the 3D toy, the safety lab, the shoppers, the tips and the catalog-wide tests all pick new entries up automatically. Check the new entry in `?gallery` and rerun `npm test`.
