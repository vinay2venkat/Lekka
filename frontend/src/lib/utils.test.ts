import { cn } from './utils';

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });

  it('lets later Tailwind classes win over conflicting earlier ones', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
