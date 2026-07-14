import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Category, Question } from "../../types";
import QuestionCard from '../QuestionCard/QuestionCard';

interface QuestionPanelProps {
  categories: Category[];
  questions: Question[];
  value: string;
}

export default function QuestionPanel({
  categories,
  questions,
  value,
}: QuestionPanelProps) {
  return (
    <div
      data-testid="question-panel"
      className="flex-1 border-b border-gray-200 overflow-scroll h-[75vh]"
    >
      <TabContext value={value}>
        {categories.map((category) => (
          <TabPanel value={String(category.id)} key={category.id}>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
}
