import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Category, Question } from "../types";
import Card from './card';

interface MainContentProps {
  categories: Category[];
  questions: Question[];
  value: string;
}

export default function MainContent({
  categories,
  questions,
  value,
}: MainContentProps) {
  return (
    <Box
      data-testid="main-content"
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
              <Card key={question.id} question={question} />
            ))}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
