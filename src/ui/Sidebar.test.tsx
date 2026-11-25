import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { useGame } from '../state/game';

vi.mock('../scene/Stage', () => ({ Stage: () => null }));
vi.mock('../scene/Plush', () => ({ Plush: () => null }));

beforeEach(() => {
  useGame.setState(useGame.getInitialState(), true);
  useGame.getState().startDesigning();
});

const marketing = async () => userEvent.click(screen.getByRole('tab', { name: /marketing/i }));

it('choosing Bunny changes the animal', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /bunny/i }));
  expect(useGame.getState().design.animal).toBe('bunny');
  expect(screen.getByRole('button', { name: /bunny/i })).toHaveAttribute('aria-pressed', 'true');
});

it('choosing a style changes the style', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /round & squishy/i }));
  expect(useGame.getState().design.style).toBe('round');
});

it('picking buttons, then babies, turns Launch off and says why', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /buttons/i }));
  await marketing();
  await userEvent.click(screen.getByRole('button', { name: /babies/i }));
  expect(screen.getByRole('button', { name: /launch/i })).toBeDisabled();
  expect(screen.getByTestId('safety')).toHaveTextContent(/button/i);
});

it('the money panel updates when the toy gets bigger', async () => {
  render(<App />);
  const before = screen.getByTestId('cost').textContent;
  await userEvent.click(screen.getByRole('button', { name: /large/i }));
  expect(screen.getByTestId('cost').textContent).not.toBe(before);
});

it('never shows popularity before launch', async () => {
  render(<App />);
  expect(screen.queryByText(/popular|★/i)).toBeNull();
  await marketing();
  expect(screen.queryByText(/popular|★/i)).toBeNull();
});

it('the name box stops at 30 letters, and an idea chip fills it', async () => {
  render(<App />);
  await marketing();
  const box = screen.getByRole('textbox', { name: /name/i });
  await userEvent.type(box, 'x'.repeat(40));
  expect(useGame.getState().design.name).toHaveLength(30);
  await userEvent.clear(box);
  const ideas = screen.getByTestId('name-ideas');
  const first = within(ideas).getAllByRole('button')[0];
  await userEvent.click(first);
  expect(useGame.getState().design.name).toBe(first.textContent);
});

it('the price slider sets the price', async () => {
  render(<App />);
  await marketing();
  const slider = screen.getByRole('slider', { name: /price/i });
  expect(slider).toHaveAttribute('min', '5');
  expect(slider).toHaveAttribute('max', '40');
});

it('Launch with a safe toy goes to sewing', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /launch/i }));
  expect(useGame.getState().screen).toBe('sewing');
});

it('warns before launch when every toy would lose money', async () => {
  render(<App />);
  expect(screen.queryByText(/lose money on every toy/i)).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: /large/i }));
  await userEvent.click(screen.getByRole('button', { name: /faux fur/i }));
  expect(screen.getByText(/lose money on every toy/i)).toBeInTheDocument();
});
