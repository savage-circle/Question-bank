import { Question } from '../../types';
import { getDifficultyStyle } from '../../constants/difficulty';

const QuestionCard = ({ question }: { question: Question }) => {
  const difficultyStyle = getDifficultyStyle(question.levelName);

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
