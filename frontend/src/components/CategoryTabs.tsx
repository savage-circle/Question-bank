import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Category } from "../types";

interface CategoryTabsProps {
  categories: Category[];
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function CategoryTabs({ categories, value, onChange }: CategoryTabsProps) {
  return (
    <Box
      data-testid="category-tabs"
      sx={{
        height: 55,
        borderBottom: '1px solid #BDBDBD',
        backgroundColor: '#FFFFFF',
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            height: 55,
          }}
        >
          <TabList
            onChange={onChange}
            centered
            sx={{
              height: 55,
              '& .MuiTabs-indicator': { backgroundColor: '#2B3B4E' },
            }}
          >
            {categories.map((category) => (
              <Tab
                sx={{
                  height: 55,
                  width: 120,
                  fontFamily: 'Inter',
                  fontWeight: 900,
                  color: '#64748B',
                  '&.Mui-selected': { color: '#1E293B' },
                }}
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
