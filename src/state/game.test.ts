import { useGame } from './game';
import { DEFAULT_DESIGN } from '../sim/design';
import { TRENDS } from '../sim/catalog/trends';

const s = () => useGame.getState();

beforeEach(() => {
  useGame.setState(useGame.getInitialState(), true);
});

it('starts on the market screen with the default design and an empty shelf', () => {
  expect(s().screen).toBe('start');
  expect(s().design).toEqual(DEFAULT_DESIGN);
  expect(s().shelf).toEqual([]);
  expect(s().report).toBeNull();
});

it('Design a toy moves to the design screen', () => {
  s().startDesigning();
  expect(s().screen).toBe('design');
});

it('will not launch a toy that fails the safety lab', () => {
  s().startDesigning();
  s().setDesign({ eyes: 'buttons', audience: 'babies' });
  s().launch();
  expect(s().screen).toBe('design');
  expect(s().shelf).toHaveLength(0);
  expect(s().report).toBeNull();
});

it('launch → sewing → report', () => {
  s().startDesigning();
  s().launch();
  expect(s().screen).toBe('sewing');
  expect(s().report?.design).toEqual(DEFAULT_DESIGN);
  expect(s().shelf).toHaveLength(1);
  s().finishSewing();
  expect(s().screen).toBe('report');
});

it('try again keeps the design and the trend', () => {
  s().newToy(() => 0.99);
  s().startDesigning();
  s().setDesign({ animal: 'fox', price: 22 });
  const trend = s().trend;
  s().launch();
  s().finishSewing();
  s().tryAgain();
  expect(s().screen).toBe('design');
  expect(s().design).toMatchObject({ animal: 'fox', price: 22 });
  expect(s().trend).toEqual(trend);
});

it('new toy picks a trend, resets the design, and keeps the shelf', () => {
  s().startDesigning();
  s().setDesign({ animal: 'fox' });
  s().launch();
  s().newToy(() => 0);
  expect(s().screen).toBe('start');
  expect(s().trend).toEqual(TRENDS[0]);
  expect(s().design).toEqual(DEFAULT_DESIGN);
  expect(s().shelf).toHaveLength(1);
  s().newToy(() => 0.999);
  expect(s().trend).toEqual(TRENDS[TRENDS.length - 1]);
});

it('keeps prices to whole dollars between $5 and $40', () => {
  s().setDesign({ price: 99 });
  expect(s().design.price).toBe(40);
  s().setDesign({ price: 1 });
  expect(s().design.price).toBe(5);
  s().setDesign({ price: 7.6 });
  expect(s().design.price).toBe(8);
});

it('caps names at 30 characters', () => {
  s().setDesign({ name: 'x'.repeat(50) });
  expect(s().design.name).toHaveLength(30);
});
