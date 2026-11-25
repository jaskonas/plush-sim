import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { useGame } from '../state/game';
import { TRENDS } from '../sim/catalog/trends';

vi.mock('../scene/Stage', () => ({ Stage: () => null }));
vi.mock('../scene/Plush', () => ({ Plush: () => null }));

beforeEach(() => {
  useGame.setState(useGame.getInitialState(), true);
  useGame.setState({ trend: TRENDS[0] });
});

it("shows this year's trend and the four shopper groups", () => {
  render(<App />);
  expect(screen.getByText(/this year's toy market/i)).toBeInTheDocument();
  expect(TRENDS[0].colour).toBe('lavender');
  expect(screen.getByTestId('trend')).toHaveTextContent(/lavender/i);
  expect(screen.getByTestId('trend')).toHaveTextContent(/bunny/i);
  expect(screen.getByTestId('trend')).toHaveTextContent(/round & squishy/i);
  for (const g of [/toddler parents/i, /kids 6–9/i, /tweens/i, /collectors/i]) {
    expect(screen.getByText(g)).toBeInTheDocument();
  }
});

it('Design a toy opens the design screen', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /design a toy/i }));
  expect(useGame.getState().screen).toBe('design');
});
