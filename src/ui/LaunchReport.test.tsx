import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { useGame } from '../state/game';
import type { Design } from '../sim/design';

vi.mock('../scene/Stage', () => ({ Stage: () => null }));
vi.mock('../scene/Plush', () => ({ Plush: () => null }));

const launchWith = (patch: Partial<Design> = {}) => {
  const s = useGame.getState();
  s.startDesigning();
  s.setDesign(patch);
  s.launch();
  s.finishSewing();
};

beforeEach(() => {
  useGame.setState(useGame.getInitialState(), true);
});

it('shows as many filled stars as the report earned', () => {
  launchWith();
  render(<App />);
  const stars = useGame.getState().report!.stars;
  const shown = screen.getByTestId('stars').textContent!;
  expect([...shown].filter((c) => c === '★')).toHaveLength(stars);
  expect([...shown].filter((c) => c === '☆')).toHaveLength(5 - stars);
});

it('has one row for each shopper group', () => {
  launchWith();
  render(<App />);
  const rows = within(screen.getByTestId('groups')).getAllByRole('listitem');
  expect(rows).toHaveLength(4);
});

it('a toy with no name is called "Your Teddy bear"', () => {
  launchWith({ name: '' });
  render(<App />);
  expect(screen.getByRole('heading', { name: /your teddy bear/i })).toBeInTheDocument();
});

it('shows a loss with a minus sign', () => {
  launchWith({ price: 5 });
  render(<App />);
  expect(useGame.getState().report!.profit).toBeLessThan(0);
  expect(screen.getByTestId('profit')).toHaveTextContent('−$');
});

it('shows a tip', () => {
  launchWith({ fabric: 'fauxFur' });
  render(<App />);
  expect(screen.getByTestId('tip')).toHaveTextContent(/💡/);
});

it('try again goes back to the same design', async () => {
  launchWith({ animal: 'fox' });
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(useGame.getState().screen).toBe('design');
  expect(useGame.getState().design.animal).toBe('fox');
});

it('new toy goes back to the market', async () => {
  launchWith();
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /new toy/i }));
  expect(useGame.getState().screen).toBe('start');
});

it('the shelf shows every toy launched this session', async () => {
  launchWith({ name: 'Biscuit' });
  const { unmount } = render(<App />);
  expect(within(screen.getByTestId('shelf')).getAllByRole('listitem')).toHaveLength(1);
  await userEvent.click(screen.getByRole('button', { name: /try again/i }));
  unmount();
  useGame.getState().setDesign({ name: 'Pickle' });
  useGame.getState().launch();
  useGame.getState().finishSewing();
  render(<App />);
  const items = within(screen.getByTestId('shelf')).getAllByRole('listitem');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Biscuit');
  expect(items[1]).toHaveTextContent('Pickle');
});

it('the shelf is hidden before anything is launched', () => {
  useGame.getState().startDesigning();
  render(<App />);
  expect(screen.queryByTestId('shelf')).toBeNull();
});
