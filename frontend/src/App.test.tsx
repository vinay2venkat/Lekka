import { render, screen } from '@testing-library/react';

import { App } from './App';
import { axeViolations } from './test/axe';

describe('App', () => {
  it('renders the product name as the page heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Lekka' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<App />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
