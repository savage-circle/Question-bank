import React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Question } from '../../types';
import QuestionCard from '../QuestionCard/QuestionCard';
import { Box } from '@mui/system';
import SearchBox from './SearchBox/SearchBox.tsx';

interface QuestionPanelProps {
  value: string;
  questions: Question[];
}

export default function QuestionPanel({
  value,
  questions,
}: QuestionPanelProps) {
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    setSearchText('');
  }, [value]);

  const searchTerm = searchText.trim().toLowerCase();

  const filteredQuestions = searchTerm
    ? questions.filter((question) =>
        question.description.toLowerCase().includes(searchTerm),
      )
    : questions;

  return (
    <div
      data-testid="question-panel"
      className="flex-1 border-b border-gray-200 overflow-scroll h-[75vh]"
    >
      <Box sx={{ width: '100%', p: 2 }}>
        <SearchBox  value={searchText} onChange={setSearchText} />
      </Box>
      <TabPanel data-testid={`question-panel-${value}`} value={value}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div>No questions found</div>
        )}
      </TabPanel>
    </div>
  );
}
