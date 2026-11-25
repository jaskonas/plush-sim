const MINUS = '−';

/** "$18,400", "−$3,200", "$3.80" (cents only below $100). */
export function formatMoney(n: number): string {
  const abs = Math.abs(n);
  const body = abs < 100 ? abs.toFixed(2) : Math.round(abs).toLocaleString('en-US');
  return `${n < 0 ? MINUS : ''}$${body}`;
}
