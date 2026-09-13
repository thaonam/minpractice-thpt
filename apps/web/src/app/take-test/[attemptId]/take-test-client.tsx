'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CountdownTimer } from '@/components/countdown-timer';
import { QuestionRenderer } from '@/components/question-renderer';
import { apiClient } from '@/lib/api-client';
import type { Attempt, TakeExam } from '@/types/exam';

export function TakeTestClient({ attempt, exam }: { attempt: Attempt; exam: TakeExam }) {
  const router = useRouter();
  const initialAnswers = Object.fromEntries((attempt.answers ?? []).filter((item) => item.answer).map((item) => [item.questionId, item.answer as string]));
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const questions = useMemo(() => exam.sections.flatMap((section) => section.questions), [exam.sections]);

  async function changeAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setSaveState('saving');
    try {
      await apiClient.saveAnswer(attempt._id, questionId, answer);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiClient.submitAttempt(attempt._id);
      router.replace(`/results/${attempt._id}`);
    } finally {
      setSubmitting(false);
    }
  }, [attempt._id, router, submitting]);

  return (
    <div className="test-layout">
      <section>
        {exam.sections.map((section, sectionIndex) => (
          <div key={`${section.title}-${sectionIndex}`}>
            <div className="test-section-heading">
              <h2>{section.title}</h2>
              {section.description ? <p className="muted">{section.description}</p> : null}
            </div>
            {section.questions.map((question) => {
              const index = questions.findIndex((item) => item._id === question._id);
              return (
                <QuestionRenderer
                  index={index}
                  key={question._id}
                  onChange={(questionId, answer) => void changeAnswer(questionId, answer)}
                  question={question}
                  value={answers[question._id]}
                />
              );
            })}
          </div>
        ))}
        <button className="btn" type="button" onClick={() => void submit()} disabled={submitting}>
          {submitting ? 'Dang nop bai...' : 'Nop bai'}
        </button>
      </section>
      <aside className="card test-sidebar">
        <h2>Bang cau hoi</h2>
        <p className="muted">Thoi gian con lai</p>
        <CountdownTimer expiresAt={attempt.expiresAt} onExpire={() => void submit()} />
        <p className="muted" style={{ marginTop: 16 }}>Da lam {Object.keys(answers).length}/{questions.length} cau</p>
        <p className={saveState === 'error' ? 'error-text' : 'muted'}>
          {saveState === 'saving' ? 'Dang luu...' : saveState === 'saved' ? 'Da luu' : saveState === 'error' ? 'Luu that bai' : 'Autosave san sang'}
        </p>
        <div className="question-nav">
          {questions.map((question, index) => <span className={answers[question._id] ? 'question-dot answered' : 'question-dot'} key={question._id}>{index + 1}</span>)}
        </div>
      </aside>
    </div>
  );
}
