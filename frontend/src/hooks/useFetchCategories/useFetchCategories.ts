import * as React from 'react';
import { getCategories } from '../../services/categoryService/categoryService';
import { Category } from "../../types";

export default function useFetchCategories() {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    let isStale = false;

    getCategories()
      .then((data) => {
        if (!isStale) setCategories(data);
      })
      .catch((error) => {
        if (!isStale) console.error(error.message, error.status);
      });

    return () => {
      isStale = true;
    };
  }, []);

  return categories;
}
