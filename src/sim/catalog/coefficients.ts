// All the money rules of thumb in one place. Numbers are round and "about right" for a
// factory-made plush toy — directionally correct, not exact.

/** Extra fabric bought because pattern pieces don't tile perfectly (30% waste). */
export const WASTE = 1.3;
/** Grams of stuffing in a 35 cm toy. Scales with size³ (volume). */
export const STUFFING_GRAMS_AT_35 = 120;
/** Factory minutes to cut and sew one pattern piece. */
export const MINUTES_PER_PIECE = 0.5;
/** Factory cost per sewing minute, in dollars. */
export const FACTORY_RATE_PER_MIN = 0.18;
/** The sewn-in label with care and safety info. */
export const TAG_COST = 0.15;
/** Share of the shop price the toy maker keeps (the shop keeps the rest). */
export const SHOP_SHARE = 0.5;
/** One-off cost of making the pattern and setting up the factory, per launch. */
export const SETUP_COST = 5000;

export const PRICE_MIN = 5;
export const PRICE_MAX = 40;

/** Everyone starts lukewarm; choices push appeal up or down from here. */
export const BASE_APPEAL = 0.4;
/** Appeal added for each thing that matches this season's trend (before the group's trend weight). */
export const TREND_BONUS = 0.1;
