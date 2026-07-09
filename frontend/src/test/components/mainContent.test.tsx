import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainContent from '../../components/mainContent';
import { Category } from '../../types/category';
import { Question } from '../../types/question';

describe('MainContent', () => {
  const categories: Category[] = [
    { id: 1, name: 'Algorithms' },
    { id: 2, name: 'System Design' },
  ];

  const questions: Question[] = [
    { id: 1, description: 'Reverse a linked list', topicName: 'Linked List', levelName: 'Easy', extensions: null },
    { id: 2, description: 'Design a rate limiter', topicName: 'Scalability', levelName: 'Hard', extensions: null },
  ];

  it('renders a card for each question in the active category panel', () => {
    render(<MainContent categories={categories} questions={questions} value="1" />);

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByText('Reverse a linked list')).toBeInTheDocument();
    expect(screen.getByText('Design a rate limiter')).toBeInTheDocument();
  });

  it('renders no cards when there are no questions', () => {
    render(<MainContent categories={categories} questions={[]} value="1" />);

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.queryByText('Reverse a linked list')).not.toBeInTheDocument();
  });
});
