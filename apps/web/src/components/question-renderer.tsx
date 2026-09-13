'use client';

import type { TakeQuestion } from '@/types/exam';

interface QuestionRendererProps {
  question: TakeQuestion;
  index: number;
  value?: string;
  onChange: (questionId: string, answer: string) => void;
}

export function QuestionRenderer({ question, index, value, onChange }: QuestionRendererProps) {
  return (
    <article className="card" style={{ marginBottom: 16 }}>
      <p className="muted">Cau {index + 1}</p>
      <h2>{question.content}</h2>
      {question.options.map((option) => (
        <label key={option.key} style={{ display: 'block', marginTop: 10 }}>
          <input
            checked={value === option.key}
            name={question._id}
            onChange={() => onChange(question._id, option.key)}
            type="radio"
          />{' '}
          {option.key}. {option.content}
        </label>
      ))}
    </article>
  );
}
