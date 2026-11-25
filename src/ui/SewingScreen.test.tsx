import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { useGame } from '../state/game';

vi.mock('../scene/Stage', () => ({ Stage: () => null }));
vi.mock('../scene/Plush', () => ({ Plush: () => null }));

beforeEach(() => {
  useGame.setState(useGame.getInitialState(), true);
  useGame.getState().startDesigning();
  useGame.getState().launch();
});

it('shows the first sewing step', () => {
  render(<App />);
  expect(screen.getByText(/cutting the pieces/i)).toBeInTheDocument();
});

it('Skip goes straight to the report', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /skip/i }));
  expect(useGame.getState().screen).toBe('report');
});
