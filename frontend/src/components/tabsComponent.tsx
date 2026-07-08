import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import fetchCategories from '../hooks/fetchCategories';
import fetchQuestions from '../hooks/fetchQuestions';
import Card from './card';


export default function TabsComponent() {
  const categories = fetchCategories();

  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const handleChange = (event: React.SyntheticEvent,newValue: string) => {
    setSelectedValue(newValue);
  };

  const value = selectedValue ?? (categories.length > 0 ? String(categories[0].id) : '');
  const questions = fetchQuestions(value === '' ? undefined : parseInt(value));

  questions.map((question) => {
    console.log(question);
    console.log(question.levelName);
  });

  if (categories.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {categories.map((category) => (
              <Tab label={category.name} value={String(category.id)} key={category.id}/>
            ))}
          </TabList>
        </Box>
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