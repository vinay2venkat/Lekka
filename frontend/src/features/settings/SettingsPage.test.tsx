import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axeViolations } from '@/test/axe';
import { renderRoute } from '@/test/renderRoute';

describe('Settings – theme', () => {
  afterEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('defaults to System with no data-theme override', () => {
    renderRoute('/settings');
    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked();
    expect(document.documentElement.dataset['theme']).toBeUndefined();
  });

  it('applies and remembers Dark, then returns to System', async () => {
    const user = userEvent.setup();
    renderRoute('/settings');

    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(window.localStorage.getItem('lekka.theme')).toBe('dark');

    await user.click(screen.getByRole('radio', { name: 'System' }));
    expect(document.documentElement.dataset['theme']).toBeUndefined();
    expect(window.localStorage.getItem('lekka.theme')).toBeNull();
  });

  it('can be operated with the keyboard', async () => {
    const user = userEvent.setup();
    renderRoute('/settings');
    screen.getByRole('radio', { name: 'System' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked();
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('shows a saved preference on load', () => {
    window.localStorage.setItem('lekka.theme', 'light');
    renderRoute('/settings');
    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = renderRoute('/settings');
    expect(await axeViolations(container)).toEqual([]);
  });
});
