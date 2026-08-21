import { useState, useEffect } from 'react';
import { getQuestionsByCategory } from '../../services/questionService/questionService';
import { Question } from '../../types';

export default function useFetchQuestions(categoryId: number | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (categoryId === undefined) return;

    let isStale = false;

    getQuestionsByCategory(categoryId)
      .then((data) => {
        if (!isStale) setQuestions(data);
      })
      .catch((error) => {
        if (!isStale) console.error(error.message, error.status);
      });

    return () => {
      isStale = true;
    };
  }, [categoryId]);

  return questions;
}
