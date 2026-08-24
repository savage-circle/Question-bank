export const ALL_DIFFICULTIES = 'all';

export const DIFFICULTY_LEVELS = ['HARD', 'MEDIUM', 'EASY'];

export const DEFAULT_DIFFICULTY_STYLE = {
  color: '#475569',
  bgcolor: '#F1F5F9',
  borderColor: '#E2E8F0',
};

export const difficultyStyles: Record<
  string,
  { bgcolor: string; color: string; borderColor: string }
> = {
  EASY: { color: '#047857', bgcolor: '#ECFDF5', borderColor: '#D1FAE5' },
  MEDIUM: { color: '#C2410C', bgcolor: '#FFF7ED', borderColor: '#FFEDD5' },
  HARD: { color: '#BE123C', bgcolor: '#FFF1F2', borderColor: '#FFE4E6' },
};

export const getDifficultyStyle = (levelName: string) =>
  difficultyStyles[levelName.toUpperCase()] ?? DEFAULT_DIFFICULTY_STYLE;
