import TabPanel from '@mui/lab/TabPanel';
import { Question } from '../../types';
import QuestionCard from '../QuestionCard/QuestionCard';

interface QuestionPanelProps {
  value: string;
  questions: Question[];
}

export default function QuestionPanel({
  value,
  questions,
}: QuestionPanelProps) {
  return (
    <div
      data-testid="question-panel"
      className="flex-1 border-b border-gray-200 overflow-scroll h-[75vh]"
    >
      <TabPanel data-testid={`question-panel-${value}`} value={value}>
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </TabPanel>
    </div>
  );
}
