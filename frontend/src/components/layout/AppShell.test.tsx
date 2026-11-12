import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axeViolations } from '@/test/axe';
import { renderRoute } from '@/test/renderRoute';

describe('AppShell', () => {
  it('shows the product name and translated nav labels', () => {
    renderRoute('/');
    expect(screen.getAllByText('Lekka').length).toBeGreaterThan(0);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });

  it('lists only screens that exist (no placeholder tabs)', () => {
    renderRoute('/');
    const [nav] = screen.getAllByRole('navigation', { name: 'Main', hidden: true });
    expect(nav).toBeDefined();
    if (!nav) return;
    expect(
      within(nav)
        .getAllByRole('link', { hidden: true })
        .map((l) => l.getAttribute('href')),
    ).toEqual(['/', '/settings']);
  });

  it('marks the current page with aria-current', () => {
    renderRoute('/settings');
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('navigates between Home and Settings', async () => {
    const user = userEvent.setup();
    renderRoute('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Settings' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
  });

  it('offers a skip link to the main content', () => {
    renderRoute('/');
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main',
    );
    expect(document.getElementById('main')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderRoute('/');
    expect(await axeViolations(container)).toEqual([]);
  });
});
