import { formatMoney } from './format';

it('formats big amounts with commas and no cents', () => {
  expect(formatMoney(18400)).toBe('$18,400');
});

it('formats losses with a real minus sign', () => {
  expect(formatMoney(-3200)).toBe('−$3,200');
});

it('shows cents for small amounts', () => {
  expect(formatMoney(3.8)).toBe('$3.80');
  expect(formatMoney(-0.5)).toBe('−$0.50');
});
