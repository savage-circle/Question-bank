import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabsComponent from '../../components/tabsComponent';
import fetchCategories from '../../hooks/fetchCategories';
import fetchQuestions from '../../hooks/fetchQuestions';
import { Category } from '../../types/category';
import { Question } from '../../types/question';

vi.mock('../../hooks/fetchCategories');
vi.mock('../../hooks/fetchQuestions');

describe('TabsComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when there are no categories', () => {
    vi.mocked(fetchCategories).mockReturnValue([]);
    vi.mocked(fetchQuestions).mockReturnValue([]);

    const { container } = render(<TabsComponent />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a tab for each category, keyed by category id', () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    vi.mocked(fetchCategories).mockReturnValue(categories);
    vi.mocked(fetchQuestions).mockReturnValue([]);

    render(<TabsComponent />);

    expect(screen.getByRole('tab', { name: 'Algorithms' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'System Design' })).toBeInTheDocument();
  });

  it('fetches and renders questions for the first category by default', () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    const questions: Question[] = [
      { id: 1, description: 'Reverse a linked list', topicName: 'Linked List', levelName: 'Easy', extensions: null },
    ];
    vi.mocked(fetchCategories).mockReturnValue(categories);
    vi.mocked(fetchQuestions).mockImplementation((categoryId) => (categoryId === 1 ? questions : []));

    render(<TabsComponent />);

    expect(fetchQuestions).toHaveBeenCalledWith(1);
    expect(screen.getByText('Reverse a linked list')).toBeInTheDocument();
  });

  it('fetches questions for the newly selected category when a different tab is clicked', async () => {
    const categories: Category[] = [
      { id: 1, name: 'Algorithms' },
      { id: 2, name: 'System Design' },
    ];
    const questionsByCategory: Record<number, Question[]> = {
      1: [{ id: 1, description: 'Reverse a linked list', topicName: 'Linked List', levelName: 'Easy', extensions: null }],
      2: [{ id: 2, description: 'Design a URL shortener', topicName: 'Scalability', levelName: 'Hard', extensions: null }],
    };
    vi.mocked(fetchCategories).mockReturnValue(categories);
    vi.mocked(fetchQuestions).mockImplementation((categoryId) => (categoryId ? questionsByCategory[categoryId] : []));
    const user = userEvent.setup();

    render(<TabsComponent />);

    expect(screen.getByText('Reverse a linked list')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: 'System Design' }));

    expect(fetchQuestions).toHaveBeenCalledWith(2);
    expect(screen.getByText('Design a URL shortener')).toBeVisible();
  });
});
