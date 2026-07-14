import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Category, Question } from "../types";
import QuestionCard from './QuestionCard';

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
    <Box
      data-testid="question-panel"
      sx={{
        flex: 1,
        borderBottom: 1,
        borderColor: 'divider',
        overflow: 'scroll',
        height: '75vh',
      }}
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
    </Box>
  );
}
