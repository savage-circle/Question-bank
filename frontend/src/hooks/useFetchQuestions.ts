import * as React from 'react';
import { getQuestionsByCategory } from '../services/questionService';
import { Question } from "../types";

export default function useFetchQuestions(categoryId: number | undefined) {
  const [questions, setQuestions] = React.useState<Question[]>([]);

  React.useEffect(() => {
    if (categoryId === undefined) return;
    
    let isStale = false;

    getQuestionsByCategory(categoryId)
      .then((data) => {
        if (!isStale) setQuestions(data);
      })
      .catch((error) => {
        if (!isStale) console.error('Failed to fetch questions', error);
      });

    return () => {
      isStale = true;
    };
  }, [categoryId]);

  return questions;
}
