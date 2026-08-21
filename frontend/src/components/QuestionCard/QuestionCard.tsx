import Box from '@mui/material/Box';
import { Question } from '../../types';
import DifficultyChip from '../common/DifficultyChip/DifficultyChip';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Box
      data-testid={`question-card-${question.id}`}
      className="flex flex-col gap-4 bg-white rounded-2xl border-[1.6px] border-(--color-border) p-6"
    >
      <p data-testid="question-description" className="font-medium text-[15px]">
        {question.description}
      </p>
      <Box className="flex gap-2">
        <DifficultyChip
          levelName={question.levelName}
          data-testid="question-level"
        />
      </Box>
    </Box>
  );
};

export default QuestionCard;
