import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { AppRoutes } from '@/AppRoutes';

export function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}
