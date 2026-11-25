import { render, screen } from '@testing-library/react';
import { App } from './App';

it('shows the game title', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /plush studio/i })).toBeInTheDocument();
});
