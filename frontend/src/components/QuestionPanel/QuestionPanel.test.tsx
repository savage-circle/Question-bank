import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import QuestionPanel from './QuestionPanel';
import { Question } from '../../types';

describe('QuestionPanel', () => {
  const questions: Question[] = [
    {
      id: 1,
      description: 'Reverse a linked list',
      topicName: 'Linked List',
      levelName: 'EASY',
      extensions: null,
    },
    {
      id: 2,
      description: 'Design a rate limiter',
      topicName: 'Scalability',
      levelName: 'HARD',
      extensions: null,
    },
  ];

  it('renders a card for each question', () => {
    render(<QuestionPanel questions={questions} />);

    const panel = screen.getByTestId('question-panel');
    expect(within(panel).getByTestId('question-card-1')).toBeInTheDocument();
    expect(within(panel).getByTestId('question-card-2')).toBeInTheDocument();
  });

  it('renders a single card when there is one question', () => {
    render(<QuestionPanel questions={[questions[0]]} />);

    const panel = screen.getByTestId('question-panel');
    expect(within(panel).getByTestId('question-card-1')).toBeInTheDocument();
    expect(
      within(panel).queryByTestId('question-card-2'),
    ).not.toBeInTheDocument();
  });

  it('renders no cards when there are no questions', () => {
    render(<QuestionPanel questions={[]} />);

    const panel = screen.getByTestId('question-panel');
    expect(panel).toBeInTheDocument();
    expect(
      within(panel).queryByTestId(/^question-card-/),
    ).not.toBeInTheDocument();
  });
});
