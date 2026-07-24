import { SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onChange: (event: SyntheticEvent, newValue: string) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onChange,
}: CategoryTabsProps) {
  return (
    <div
      data-testid="category-tabs"
      className="border-b-[1.6px] border-t-[1.6px] border-(--color-border)"
    >
      <Tabs
        value={selectedCategory}
        onChange={onChange}
        centered
        data-testid="category-tab-list"
        sx={{
          '& .MuiTab-root': {
            color: 'var(--color-disabled)',
            px: 8,
          },
          '& .Mui-selected': {
            color: 'var(--color-primary) !important',
            fontWeight: 800,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--color-primary)',
            height: '3px',
          },
        }}
      >
        {categories.map((category) => (
          <Tab
            data-testid={`category-tab-${category.id}`}
            label={category.name}
            value={String(category.id)}
            key={category.id}
          />
        ))}
      </Tabs>
    </div>
  );
}
