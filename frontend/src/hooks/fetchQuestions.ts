import * as React from 'react';
import { getQuestionsByCategory } from '../services/questionService';
import { Question } from '../types/question';

export default function useFetchQuestions(categoryId: number | undefined) {
  const [questions, setQuestions] = React.useState<Question[]>([]);

  React.useEffect(() => {
    if (categoryId === undefined) {
      return;
    }
    getQuestionsByCategory(categoryId)
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Failed to fetch questions', error));
  }, [categoryId]);

  return questions;
}
