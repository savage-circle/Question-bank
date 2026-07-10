import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../components/card';
import { Question } from '../../types/question';

describe('Card', () => {
  const baseQuestion: Question = {
    id: 1,
    description: 'Reverse a linked list',
    topicName: 'Linked List',
    levelName: 'EASY',
    extensions: null,
  };

  it('renders the question description and level', () => {
    render(<Card question={baseQuestion} />);

    expect(screen.getByText('Reverse a linked list')).toBeInTheDocument();
    expect(screen.getByText('EASY')).toBeInTheDocument();
  });

  it.each([
    ['EASY', '#ECFDF5', '#047857', '#D1FAE5'],
    ['MEDIUM', '#FFF7ED', '#C2410C', '#FFEDD5'],
    ['HARD', '#FFF1F2', '#BE123C', '#FFE4E6'],
  ])('applies the correct style for the %s difficulty level', (levelName, bgcolor, color, borderColor) => {
    render(<Card question={{ ...baseQuestion, levelName }} />);

    expect(screen.getByText(levelName)).toHaveStyle({
      backgroundColor: bgcolor,
      color,
      borderColor,
    });
  });

  it('falls back to a default style for an unrecognized difficulty level', () => {
    render(<Card question={{ ...baseQuestion, levelName: 'Unknown' }} />);

    expect(screen.getByText('Unknown')).toHaveStyle({
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderColor: '#e2e8f0',
    });
  });
});
