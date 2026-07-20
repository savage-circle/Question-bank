import { Question } from '../../types';

const difficultyStyles: Record<
  string,
  { bgcolor: string; color: string; borderColor: string }
> = {
  EASY: { color: '#047857', bgcolor: '#ECFDF5', borderColor: '#D1FAE5' },
  MEDIUM: { color: '#C2410C', bgcolor: '#FFF7ED', borderColor: '#FFEDD5' },
  HARD: { color: '#BE123C', bgcolor: '#FFF1F2', borderColor: '#FFE4E6' },
};

const QuestionCard = ({ question }: { question: Question }) => {
  const difficultyStyle = difficultyStyles[question.levelName] ?? {
    bgcolor: '#f1f5f9',
    color: '#475569',
    borderColor: '#e2e8f0',
  };

  return (
    <div
      data-testid={`question-card-${question.id}`}
      className="bg-white rounded-2xl border border-[#f3f4f6] shadow p-6 mb-4 font-sans"
    >
      <p
        data-testid="question-description"
        className="font-[Inter] font-medium text-[15px] leading-6 align-middle text-[#1E293B]"
      >
        {question.description}
      </p>
      <div className="flex mt-4 gap-2">
        <span
          data-testid="question-level"
          className="px-3 py-1 rounded-lg border font-[Inter] font-medium text-[12px] leading-[18px] tracking-[0.19px] align-middle"
          style={{
            backgroundColor: difficultyStyle.bgcolor,
            color: difficultyStyle.color,
            borderColor: difficultyStyle.borderColor,
          }}
        >
          {question.levelName}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
