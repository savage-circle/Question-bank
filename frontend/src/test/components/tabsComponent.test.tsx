import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LabTabs from '../../components/tabsComponent';
import fetchCategories from '../../hooks/fetchCategories';
import { Category } from '../../types/category';

vi.mock('../../hooks/fetchCategories');

describe('LabTabs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders no tabs when there are no categories', () => {
    vi.mocked(fetchCategories).mockReturnValue([]);

    render(<LabTabs />);

    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('renders a tab and panel for each category', () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    vi.mocked(fetchCategories).mockReturnValue(categories);

    render(<LabTabs />);

    expect(screen.getByRole('tab', { name: 'Algorithms' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'System Design' })).toBeInTheDocument();
    expect(screen.getByText('Algorithms questions')).toBeInTheDocument();
  });

  it('switches the visible panel when a different tab is selected', async () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    vi.mocked(fetchCategories).mockReturnValue(categories);
    const user = userEvent.setup();

    render(<LabTabs />);

    expect(screen.getByText('Algorithms questions')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: 'System Design' }));

    expect(screen.getByText('System Design questions')).toBeVisible();
  });
});
