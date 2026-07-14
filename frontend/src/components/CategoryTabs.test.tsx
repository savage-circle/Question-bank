import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryTabs from './CategoryTabs';
import { Category } from "../types";

describe('CategoryTabs', () => {
  const categories: Category[] = [
    { id: 1, name: 'Algorithms' },
    { id: 2, name: 'System Design' },
  ];

  it('renders a tab for each category', () => {
    render(<CategoryTabs categories={categories} value="1" onChange={vi.fn()} />);

    expect(screen.getByTestId('category-tabs')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Algorithms' })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'System Design' }),
    ).toBeInTheDocument();
  });

  it('marks the tab matching the selected value as selected', () => {
    render(<CategoryTabs categories={categories} value="2" onChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'System Design' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Algorithms' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('calls onChange with the newly selected category value when a tab is clicked', async () => {
    const onChange = vi.fn();
    render(<CategoryTabs categories={categories} value="1" onChange={onChange} />);

    await userEvent.click(screen.getByRole('tab', { name: 'System Design' }));

    expect(onChange).toHaveBeenCalledWith(expect.anything(), '2');
  });

  it('renders no tabs when there are no categories', () => {
    render(<CategoryTabs categories={[]} value="" onChange={vi.fn()} />);

    expect(screen.getByTestId('category-tabs')).toBeInTheDocument();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });
});
