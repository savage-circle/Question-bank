import React, { useMemo, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import useFetchQuestions from './hooks/useFetchQuestions/useFetchQuestions';
import useFetchCategories from './hooks/useFetchCategories/useFetchCategories';
import CategoryTabs from './components/CategoryTabs/CategoryTabs';
import QuestionPanel from './components/QuestionPanel/QuestionPanel';
import DifficultyFilter from './components/DifficultyFilter/DifficultyFilter';
import { ALL_DIFFICULTIES } from './constants/difficulty';

function App() {
  const categories = useFetchCategories();

  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: ALL_DIFFICULTIES,
    search: '',
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedValue(newValue);
    setFilters((prev) => ({ ...prev, difficulty: ALL_DIFFICULTIES }));
  };

  const value =
    selectedValue ?? (categories.length > 0 ? String(categories[0].id) : '');

  const questions = useFetchQuestions(
    value === '' ? undefined : parseInt(value),
  );

  const visibleQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          filters.difficulty === ALL_DIFFICULTIES ||
          question.levelName.toLowerCase() === filters.difficulty.toLowerCase(),
      ),
    [questions, filters],
  );

  const changeLevel = (levelName: string) => {
    setFilters((prev) => ({ ...prev, difficulty: levelName }));
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        data-testid="app-layout"
        className="w-screen h-screen border border-[#BDBDBD] box-border flex flex-col bg-[#F8FAFC]"
      >
        <div
          data-testid="header"
          className="h-[70px] border-b border-[#BDBDBD] bg-white"
        />

        <TabContext value={value}>
          <CategoryTabs categories={categories} onChange={handleChange} />

          <div data-testid="body" className="flex-1 px-6 py-8 flex gap-10">
            <div
              data-testid="sidebar"
              className="w-[280px] border border-[#BDBDBD] bg-white"
            >
              <DifficultyFilter
                selected={filters.difficulty}
                onChange={changeLevel}
              />
            </div>
            <QuestionPanel value={value} questions={visibleQuestions} />

            <div
              data-testid="footer"
              className="h-[80px] border-t border-[#BDBDBD]"
            />
          </div>
        </TabContext>
      </div>
    </div>
  );
}

export default App;
