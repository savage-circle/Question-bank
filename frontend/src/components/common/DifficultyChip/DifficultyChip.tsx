const difficultyStyles: Record<
  string,
  { bgcolor: string; color: string; borderColor: string }
> = {
  EASY: {
    color: 'var(--color-easy-text)',
    bgcolor: 'var(--color-easy-bg)',
    borderColor: 'var(--color-easy-border)',
  },
  MEDIUM: {
    color: 'var(--color-medium-text)',
    bgcolor: 'var(--color-medium-bg)',
    borderColor: 'var(--color-medium-border)',
  },
  HARD: {
    color: 'var(--color-hard-text)',
    bgcolor: 'var(--color-hard-bg)',
    borderColor: 'var(--color-hard-border)',
  },
};

interface DifficultyChipProps {
  levelName: string;
  'data-testid'?: string;
}

const DifficultyChip = ({
  levelName,
  'data-testid': testId = 'difficulty-chip',
}: DifficultyChipProps) => {
  const difficultyStyle = difficultyStyles[levelName] ?? {
    bgcolor: 'var(--color-default-bg)',
    color: 'var(--color-default-text)',
    borderColor: 'var(--color-default-border)',
  };

  return (
    <span
      data-testid={testId}
      className="px-3 py-1 rounded-lg border font-medium text-[12px]"
      style={{
        backgroundColor: difficultyStyle.bgcolor,
        color: difficultyStyle.color,
        borderColor: difficultyStyle.borderColor,
      }}
    >
      {levelName}
    </span>
  );
};

export default DifficultyChip;
