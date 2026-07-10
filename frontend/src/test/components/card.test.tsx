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
    ['EASY', '#ecfdf5', '#059669'],
    ['MEDIUM', '#fff7ed', '#c2410c'],
    ['HARD', '#fef2f2', '#dc2626'],
  ])('applies the correct style for the %s difficulty level', (levelName, bgcolor, color) => {
    render(<Card question={{ ...baseQuestion, levelName }} />);

    expect(screen.getByText(levelName)).toHaveStyle({ backgroundColor: bgcolor, color });
  });

  it('falls back to a default style for an unrecognized difficulty level', () => {
    render(<Card question={{ ...baseQuestion, levelName: 'Unknown' }} />);

    expect(screen.getByText('Unknown')).toHaveStyle({ backgroundColor: '#f1f5f9', color: '#475569' });
  });
});
