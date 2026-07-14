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

  it('renders the question description and level', () => {
    render(<QuestionCard question={baseQuestion} />);

    expect(screen.getByTestId('question-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('question-description')).toHaveTextContent(
      'Reverse a linked list',
    );
    expect(screen.getByTestId('question-level')).toHaveTextContent('EASY');
  });

  it.each([
    ['EASY', '#ECFDF5', '#047857', '#D1FAE5'],
    ['MEDIUM', '#FFF7ED', '#C2410C', '#FFEDD5'],
    ['HARD', '#FFF1F2', '#BE123C', '#FFE4E6'],
  ])(
    'applies the correct style for the %s difficulty level',
    (levelName, bgcolor, color, borderColor) => {
      render(<QuestionCard question={{ ...baseQuestion, levelName }} />);

      expect(screen.getByTestId('question-level')).toHaveStyle({
        backgroundColor: bgcolor,
        color,
        borderColor,
      });
    },
  );

  it('falls back to a default style for an unrecognized difficulty level', () => {
    render(
      <QuestionCard question={{ ...baseQuestion, levelName: 'Unknown' }} />,
    );

    expect(screen.getByTestId('question-level')).toHaveStyle({
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderColor: '#e2e8f0',
    });
  });
});
