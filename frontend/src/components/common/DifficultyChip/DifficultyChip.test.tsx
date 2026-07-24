import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DifficultyChip from './DifficultyChip';

describe('DifficultyChip', () => {
  it('renders the difficulty level name', () => {
    render(<DifficultyChip levelName="EASY" />);
    expect(screen.getByTestId('difficulty-chip')).toHaveTextContent('EASY');
  });

  it.each([
    [
      'EASY',
      'var(--color-easy-bg)',
      'var(--color-easy-text)',
      'var(--color-easy-border)',
    ],
    [
      'MEDIUM',
      'var(--color-medium-bg)',
      'var(--color-medium-text)',
      'var(--color-medium-border)',
    ],
    [
      'HARD',
      'var(--color-hard-bg)',
      'var(--color-hard-text)',
      'var(--color-hard-border)',
    ],
  ])(
    'applies the correct style for the %s difficulty level',
    (levelName, bgcolor, color, borderColor) => {
      render(<DifficultyChip levelName={levelName} />);

      expect(screen.getByTestId('difficulty-chip')).toHaveStyle({
        backgroundColor: bgcolor,
        color,
        borderColor,
      });
    },
  );

  it('falls back to a default style for an unrecognized difficulty level', () => {
    render(<DifficultyChip levelName="Unknown" />);

    expect(screen.getByTestId('difficulty-chip')).toHaveStyle({
      backgroundColor: 'var(--color-default-bg)',
      color: 'var(--color-default-text)',
      borderColor: 'var(--color-default-border)',
    });
  });

  it('supports custom data-testid prop', () => {
    render(<DifficultyChip levelName="EASY" data-testid="custom-level-id" />);
    expect(screen.getByTestId('custom-level-id')).toBeInTheDocument();
  });
});
