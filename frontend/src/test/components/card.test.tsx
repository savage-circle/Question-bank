import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../components/card';
import { Question } from '../../types/question';

describe('Card', () => {
  const baseQuestion: Question = {
    id: 1,
    description: 'Reverse a linked list',
    topicName: 'Linked List',
    levelName: 'Easy',
    extensions: null,
  };

  it('renders the question description, level, and topic', () => {
    render(<Card question={baseQuestion} />);

    expect(screen.getByText('Reverse a linked list')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Linked List')).toBeInTheDocument();
  });

  it('applies a known style for a recognized difficulty level', () => {
    render(<Card question={baseQuestion} />);

    expect(screen.getByText('Easy')).toHaveClass('bg-emerald-50', 'text-emerald-600');
  });

  it('falls back to a default style for an unrecognized difficulty level', () => {
    render(<Card question={{ ...baseQuestion, levelName: 'Unknown' }} />);

    expect(screen.getByText('Unknown')).toHaveClass('bg-slate-100', 'text-slate-600');
  });
});
