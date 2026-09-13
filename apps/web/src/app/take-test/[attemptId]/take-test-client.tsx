'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CountdownTimer } from '@/components/countdown-timer';
import { QuestionRenderer } from '@/components/question-renderer';
import type { TakeExam } from '@/types/exam';

export function TakeTestClient({ exam }: { exam: TakeExam }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const expiresAt = useMemo(() => new Date(Date.now() + exam.durationMinutes * 60 * 1000).toISOString(), [exam.durationMinutes]);
  const questions = exam.sections.flatMap((section) => section.questions);

  return (
    <div className="grid">
      <section>
        {questions.map((question, index) => (
          <QuestionRenderer
            index={index}
            key={question._id}
            onChange={(questionId, answer) => setAnswers((current) => ({ ...current, [questionId]: answer }))}
            question={question}
            value={answers[question._id]}
          />
        ))}
        <Link className="btn" href={`/results/${exam._id}`}>
          Nop bai demo
        </Link>
      </section>
      <aside className="card">
        <h2>Bang cau hoi</h2>
        <p className="muted">Thoi gian con lai</p>
        <CountdownTimer expiresAt={expiresAt} />
        <p className="muted" style={{ marginTop: 16 }}>
          Da lam {Object.keys(answers).length}/{questions.length} cau
        </p>
      </aside>
    </div>
  );
}
