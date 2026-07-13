import { Box } from '@mui/system';
import React from 'react';
import useFetchQuestions from './hooks/fetchQuestions';
import useFetchCategories from './hooks/fetchCategories';
import Toolbar from './components/toolbar';
import MainContent from './components/mainContent';

function App() {
  const categories = useFetchCategories();

  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedValue(newValue);
  };

  const value =
    selectedValue ?? (categories.length > 0 ? String(categories[0].id) : '');
  const questions = useFetchQuestions(value === '' ? undefined : parseInt(value));

  if (categories.length === 0) {
    return null;
  }

  return (
    <div>
      <Box
        data-testid="app-layout"
        sx={{
          width: '100vw',
          height: '100vh',
          border: '1px solid #BDBDBD',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#F8FAFC',
        }}
      >
        <Box
          data-testid="header"
          sx={{
            height: 70,
            borderBottom: '1px solid #BDBDBD',
            backgroundColor: '#FFFFFF',
          }}
        />

        <Toolbar categories={categories} value={value} onChange={handleChange} />

        <Box
          data-testid="body"
          sx={{
            flex: 1,
            px: 3,
            py: 4,
            display: 'flex',
            gap: 5,
          }}
        >
          <Box
            data-testid="sidebar"
            sx={{
              width: 280,
              border: '1px solid #BDBDBD',
              backgroundColor: '#FFFFFF',
            }}
          />

          <MainContent categories={categories} questions={questions} value={value} />

          <Box
            data-testid="footer"
            sx={{
              height: 80,
              borderTop: '1px solid #BDBDBD',
            }}
          />
        </Box>
      </Box>
    </div>
  );
}

export default App;
