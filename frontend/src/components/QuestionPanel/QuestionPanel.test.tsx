import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TabContext from '@mui/lab/TabContext';
import QuestionPanel from './QuestionPanel';
import { Question } from '../../types';

function renderWithTabContext(value: string, ui: React.ReactElement) {
  return render(<TabContext value={value}>{ui}</TabContext>);
}

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
    renderWithTabContext(
      '1',
      <QuestionPanel value="1" questions={questions} />,
    );

    const activePanel = screen.getByTestId('question-panel-1');
    expect(
      within(activePanel).getByTestId('question-card-1'),
    ).toBeInTheDocument();
    expect(
      within(activePanel).getByTestId('question-card-2'),
    ).toBeInTheDocument();
  });

  it('renders no cards when there are no questions', () => {
    renderWithTabContext('1', <QuestionPanel value="1" questions={[]} />);

    const activePanel = screen.getByTestId('question-panel-1');
    expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    expect(
      within(activePanel).queryByTestId(/^question-card-/),
    ).not.toBeInTheDocument();
  });
});
