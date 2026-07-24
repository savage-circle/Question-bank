import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';

describe('QuestionCard', () => {
  const baseQuestion: Question = {
    id: 1,
    description: 'Reverse a linked list',
    topicName: 'Linked List',
    levelName: 'EASY',
    extensions: null,
  };

  it('renders the question description and levelName', () => {
    render(<QuestionCard question={baseQuestion} />);

    expect(screen.getByTestId('question-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('question-description')).toHaveTextContent(
      'Reverse a linked list',
    );
    expect(screen.getByTestId('question-level')).toHaveTextContent('EASY');
  });

  it('renders another question with different data', () => {
    const question: Question = {
      id: 2,
      description: 'Implement a queue using two stacks',
      topicName: 'Stacks and Queues',
      levelName: 'MEDIUM',
      extensions: null,
    };
    render(<QuestionCard question={question} />);

    expect(screen.getByTestId('question-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('question-description')).toHaveTextContent(
      'Implement a queue using two stacks',
    );
    expect(screen.getByTestId('question-level')).toHaveTextContent('MEDIUM');
  });

  it('renders a hard question', () => {
    const question: Question = {
      id: 3,
      description: 'Find the median of two sorted arrays',
      topicName: 'Arrays',
      levelName: 'HARD',
      extensions: null,
    };
    render(<QuestionCard question={question} />);

    expect(screen.getByTestId('question-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('question-description')).toHaveTextContent(
      'Find the median of two sorted arrays',
    );
    expect(screen.getByTestId('question-level')).toHaveTextContent('HARD');
  });

  it('renders with an empty description', () => {
    const question: Question = {
      id: 4,
      description: '',
      topicName: 'Arrays',
      levelName: 'EASY',
      extensions: null,
    };
    render(<QuestionCard question={question} />);

    expect(screen.getByTestId('question-card-4')).toBeInTheDocument();
    expect(screen.getByTestId('question-description')).toHaveTextContent('');
  });
});
