import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DifficultyChip from './DifficultyChip';

describe('DifficultyChip', () => {
  it('renders the difficulty level name for EASY', () => {
    render(<DifficultyChip levelName="EASY" />);
    expect(screen.getByTestId('difficulty-chip')).toHaveTextContent('EASY');
  });

  it('renders the difficulty level name for MEDIUM', () => {
    render(<DifficultyChip levelName="MEDIUM" />);
    expect(screen.getByTestId('difficulty-chip')).toHaveTextContent('MEDIUM');
  });

  it('renders the difficulty level name for HARD', () => {
    render(<DifficultyChip levelName="HARD" />);
    expect(screen.getByTestId('difficulty-chip')).toHaveTextContent('HARD');
  });

  it('supports custom data-testid prop', () => {
    render(<DifficultyChip levelName="EASY" data-testid="custom-level-id" />);
    expect(screen.getByTestId('custom-level-id')).toBeInTheDocument();
  });
});
