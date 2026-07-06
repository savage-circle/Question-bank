import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import fetchCategories from '../hooks/fetchCategories';

export default function LabTabs() {
  const [value, setValue] = React.useState('0');
  const categories = fetchCategories();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {categories.map((category, i) => (
              <Tab label={category.name} value={String(i)} key={category.id}/>
            ))}
          </TabList>
        </Box>
        {categories.map((category, i) => (
          <TabPanel value={String(i)} key={category.id}>
            {category.name} questions
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}