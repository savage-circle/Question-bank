import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function CategoryTabs({
  categories,
  onChange,
}: CategoryTabsProps) {
  return (
    <div
      data-testid="category-tabs"
      className="h-[55px] border-b border-[#BDBDBD] bg-white"
    >
      <div data-testid="category-tabs-list" className="h-[55px]">
        <TabList
          onChange={onChange}
          centered
          data-testid="category-tab-list"
          className="h-[55px] [&_.MuiTabs-indicator]:bg-[#2B3B4E]"
        >
          {categories.map((category) => (
            <Tab
              data-testid={`category-tab-${category.id}`}
              className="h-[55px] w-[120px] font-[Inter] font-black text-[#64748B] [&.Mui-selected]:text-[#1E293B]"
              label={category.name}
              value={String(category.id)}
              key={category.id}
            />
          ))}
        </TabList>
      </div>
    </div>
  );
}
