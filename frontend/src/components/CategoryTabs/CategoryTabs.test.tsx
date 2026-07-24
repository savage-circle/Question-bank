import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryTabs from './CategoryTabs';
import { Category } from '../../types';

describe('CategoryTabs', () => {
  const categories: Category[] = [
    { id: 1, name: 'Algorithms' },
    { id: 2, name: 'System Design' },
  ];

  it('renders a tab for each category', () => {
    render(
      <CategoryTabs
        categories={categories}
        selectedCategory="1"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('category-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('category-tab-list')).toBeInTheDocument();
    expect(screen.getByTestId('category-tab-1')).toHaveTextContent(
      'Algorithms',
    );
    expect(screen.getByTestId('category-tab-2')).toHaveTextContent(
      'System Design',
    );
  });

  it('marks the tab matching the selected value as selected', () => {
    render(
      <CategoryTabs
        categories={categories}
        selectedCategory="2"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('category-tab-2')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByTestId('category-tab-1')).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('calls onChange with the newly selected category value when a tab is clicked', async () => {
    const onChange = vi.fn();
    render(
      <CategoryTabs
        categories={categories}
        selectedCategory="1"
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByTestId('category-tab-2'));

    expect(onChange).toHaveBeenCalledWith(expect.anything(), '2');
  });

  it('renders no tabs when there are no categories', () => {
    render(
      <CategoryTabs categories={[]} selectedCategory="" onChange={vi.fn()} />,
    );

    expect(screen.getByTestId('category-tabs')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/^category-tab-\d+$/)).toHaveLength(0);
  });
});
