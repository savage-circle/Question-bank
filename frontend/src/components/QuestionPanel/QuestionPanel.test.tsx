import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import QuestionPanel from './QuestionPanel';
import { Category, Question } from "../../types";

describe('QuestionPanel', () => {
  const categories: Category[] = [
    { id: 1, name: 'Algorithms' },
    { id: 2, name: 'System Design' },
  ];

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

  it('renders a card for each question inside the active category panel', () => {
    render(
      <QuestionPanel categories={categories} questions={questions} value="1" />,
    );

    expect(screen.getByTestId('question-panel')).toBeInTheDocument();

    const activePanel = screen.getByTestId('question-panel-1');
    expect(
      within(activePanel).getByTestId('question-card-1'),
    ).toBeInTheDocument();
    expect(
      within(activePanel).getByTestId('question-card-2'),
    ).toBeInTheDocument();
  });

  it('does not render the active category panel content inside the inactive panel', () => {
    render(
      <QuestionPanel categories={categories} questions={questions} value="1" />,
    );

    const inactivePanel = screen.getByTestId('question-panel-2');
    expect(
      within(inactivePanel).queryByTestId('question-card-1'),
    ).not.toBeInTheDocument();
  });

  it('renders no cards when there are no questions', () => {
    render(<QuestionPanel categories={categories} questions={[]} value="1" />);

    const activePanel = screen.getByTestId('question-panel-1');
    expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    expect(within(activePanel).queryByTestId(/^question-card-/)).not.toBeInTheDocument();
  });
});
