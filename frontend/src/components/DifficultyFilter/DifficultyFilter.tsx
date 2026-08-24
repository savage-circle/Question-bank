import {
  ALL_DIFFICULTIES,
  DEFAULT_DIFFICULTY_STYLE,
  DIFFICULTY_LEVELS,
  getDifficultyStyle,
} from '../../constants/difficulty';

interface DifficultyFilterProps {
  selected: string;
  onChange: (difficulty: string) => void;
}

export default function DifficultyFilter({
  selected,
  onChange,
}: DifficultyFilterProps) {
  return (
    <div data-testid="difficulty-filter" className="flex flex-col gap-2 p-4">
      <h6 className="uppercase font-[Inter] font-semibold text-[12px] tracking-[0.19px] text-[#64748B]">
        difficulty
      </h6>
      <div
        role="group"
        className="inline-flex self-start rounded-xl border border-[#E2E8F0] bg-white overflow-hidden divide-x divide-[#E2E8F0]"
      >
        {DIFFICULTY_LEVELS.map((difficulty) => {
          const isSelected = selected.toUpperCase() === difficulty;
          const style = getDifficultyStyle(difficulty);

          return (
            <button
              key={difficulty}
              type="button"
              data-testid={`difficulty-${difficulty.toLowerCase()}`}
              aria-pressed={isSelected}
              onClick={() =>
                onChange(isSelected ? ALL_DIFFICULTIES : difficulty)
              }
              className="px-4 py-2 font-[Inter] font-medium text-[14px] capitalize cursor-pointer transition-colors"
              style={{
                backgroundColor: isSelected ? style.bgcolor : '#FFFFFF',
                color: isSelected ? style.color : DEFAULT_DIFFICULTY_STYLE.color,
              }}
            >
              {difficulty.toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
