import Box from '@mui/material/Box';
import { Question } from '../../types';
import QuestionCard from '../QuestionCard/QuestionCard';

interface QuestionPanelProps {
  questions: Question[];
}

export default function QuestionPanel({ questions }: QuestionPanelProps) {
  return (
    <Box
      data-testid="question-panel"
      className="flex flex-col flex-1 gap-4 overflow-scroll"
    >
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </Box>
  );
}
