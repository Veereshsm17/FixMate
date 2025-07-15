import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Welcome to FixMate headline', () => {
  render(<App />);
  const headline = screen.getByText(/welcome to fixmate/i);
  expect(headline).toBeInTheDocument();
});
