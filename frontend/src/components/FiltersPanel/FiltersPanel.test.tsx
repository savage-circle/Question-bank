import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FiltersPanel from './FiltersPanel';

describe('FiltersPanel', () => {
  it('renders the filters panel', () => {
    render(<FiltersPanel />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Filters Here')).toBeInTheDocument();
  });
});
