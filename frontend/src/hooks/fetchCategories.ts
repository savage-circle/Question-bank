import * as React from 'react';
import { getCategories } from '../services/categoryService';
import { Category } from "../types";

export default function useFetchCategories() {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error('Failed to fetch categories', error));
  }, []);

  return categories;
}
