import Box from '@mui/material/Box';
import QuestionPanel from '../QuestionPanel/QuestionPanel';
import { Question } from '../../types';
import FiltersPanel from '../FiltersPanel/FiltersPanel';

interface CategoryContentProps {
  questions: Question[];
}

const CategoryContent = ({ questions }: CategoryContentProps) => {
  return (
    <Box
      data-testid="body"
      className="flex flex-1 bg-(--color-body-bg) px-6 py-8 gap-10"
    >
      <FiltersPanel />

      <QuestionPanel questions={questions} />
    </Box>
  );
};

export default CategoryContent;
