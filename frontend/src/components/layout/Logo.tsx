import { cn } from '@/lib/utils';

/** The Lekka mark: a lowercase l standing on a level beam. Decorative; pair it with the name. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      className={cn('size-8', className)}
    >
      <rect width="512" height="512" rx="120" fill="#0F5C57" />
      <rect x="216" y="96" width="80" height="268" rx="40" fill="#FFFFFF" />
      <rect x="112" y="356" width="288" height="64" rx="32" fill="#F2B544" />
    </svg>
  );
}
