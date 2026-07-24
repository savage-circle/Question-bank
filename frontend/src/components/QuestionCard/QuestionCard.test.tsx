import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';

describe('QuestionCard', () => {
  const baseQuestion: Question = {
    id: 1,
    description: 'Reverse a linked list',
    topicName: 'Linked List',
    levelName: 'EASY',
    extensions: null,
  };

  it('renders the question description and levelName', () => {
    render(<QuestionCard question={baseQuestion} />);

    expect(screen.getByTestId('question-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('question-description')).toHaveTextContent(
      'Reverse a linked list',
    );
    expect(screen.getByTestId('question-level')).toHaveTextContent('EASY');
  });
});
