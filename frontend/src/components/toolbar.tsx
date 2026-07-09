import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Category } from '../types/category';
import { Height } from '@mui/icons-material';

interface ToolbarProps {
  categories: Category[];
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function Toolbar({ categories, value, onChange }: ToolbarProps) {
  return (
    <Box
      data-testid="toolbar"
      sx={{
        height: 70,
        borderBottom: '1px solid #BDBDBD'
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            height: 70
          }}
        >
          <TabList onChange={onChange} centered sx={{ height: 70 }}>
            {categories.map((category) => (
              <Tab
                sx={{ height: 70 , width: 120,}}
                label={category.name}
                value={String(category.id)}
                key={category.id}
              />
            ))}
          </TabList>
        </Box>
      </TabContext>
    </Box>
  );
}
