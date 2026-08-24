import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DifficultyFilter from './DifficultyFilter';
import {
  ALL_DIFFICULTIES,
  DIFFICULTY_LEVELS,
  getDifficultyStyle,
} from '../../constants/difficulty';

describe('DifficultyFilter', () => {
  it('renders a segment for every difficulty level', () => {
    render(<DifficultyFilter selected={ALL_DIFFICULTIES} onChange={vi.fn()} />);

    expect(screen.getByTestId('difficulty-filter')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(
      DIFFICULTY_LEVELS.length,
    );
    DIFFICULTY_LEVELS.forEach((difficulty) => {
      expect(
        screen.getByTestId(`difficulty-${difficulty.toLowerCase()}`),
      ).toHaveTextContent(difficulty.toLowerCase());
    });
  });

  it.each(DIFFICULTY_LEVELS)(
    'marks only %s as pressed when it is selected',
    (selected) => {
      render(<DifficultyFilter selected={selected} onChange={vi.fn()} />);

      DIFFICULTY_LEVELS.forEach((difficulty) => {
        expect(
          screen.getByTestId(`difficulty-${difficulty.toLowerCase()}`),
        ).toHaveAttribute('aria-pressed', String(difficulty === selected));
      });
    },
  );

  it('marks nothing as pressed when no difficulty is selected', () => {
    render(<DifficultyFilter selected={ALL_DIFFICULTIES} onChange={vi.fn()} />);

    expect(screen.queryAllByRole('button', { pressed: true })).toHaveLength(0);
  });

  it.each(DIFFICULTY_LEVELS)(
    'applies the %s palette from the constants when selected',
    (difficulty) => {
      const { bgcolor, color } = getDifficultyStyle(difficulty);
      render(<DifficultyFilter selected={difficulty} onChange={vi.fn()} />);

      expect(
        screen.getByTestId(`difficulty-${difficulty.toLowerCase()}`),
      ).toHaveStyle({ backgroundColor: bgcolor, color });
    },
  );

  it.each(DIFFICULTY_LEVELS)(
    'calls onChange with %s when that segment is clicked',
    async (difficulty) => {
      const onChange = vi.fn();
      render(
        <DifficultyFilter selected={ALL_DIFFICULTIES} onChange={onChange} />,
      );

      await userEvent.click(
        screen.getByTestId(`difficulty-${difficulty.toLowerCase()}`),
      );

      expect(onChange).toHaveBeenCalledWith(difficulty);
    },
  );

  it('clears the filter when the selected difficulty is clicked again', async () => {
    const [difficulty] = DIFFICULTY_LEVELS;
    const onChange = vi.fn();
    render(<DifficultyFilter selected={difficulty} onChange={onChange} />);

    await userEvent.click(
      screen.getByTestId(`difficulty-${difficulty.toLowerCase()}`),
    );

    expect(onChange).toHaveBeenCalledWith(ALL_DIFFICULTIES);
  });

  it('matches the selected difficulty regardless of casing', () => {
    const [difficulty] = DIFFICULTY_LEVELS;
    render(
      <DifficultyFilter
        selected={difficulty.toLowerCase()}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId(`difficulty-${difficulty.toLowerCase()}`),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
