import { SyntheticEvent, useState } from 'react';
import useFetchQuestions from './hooks/useFetchQuestions/useFetchQuestions';
import useFetchCategories from './hooks/useFetchCategories/useFetchCategories';
import CategoryTabs from './components/CategoryTabs/CategoryTabs';
import Box from '@mui/material/Box';
import Header from './components/Header/Header';
import CategoryContent from './components/CategoryContent/CategoryContent';

function App() {
  const categories = useFetchCategories();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const activeTab =
    selectedTab ?? (categories.length > 0 ? String(categories[0].id) : '');
  const questions = useFetchQuestions(
    activeTab ? parseInt(activeTab) : undefined,
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <Box className="w-screen h-screen flex flex-col">
      <Header />

      <CategoryTabs
        categories={categories}
        selectedCategory={activeTab}
        onChange={handleTabChange}
      />
      <CategoryContent questions={questions} />
    </Box>
  );
}

export default App;
