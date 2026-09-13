'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const timers = useRef(new Map<string, number>());
  const pendingAnswers = useRef(new Map<string, string>());
  const questions = useMemo(() => exam.sections.flatMap((section) => section.questions), [exam.sections]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const persistAnswer = useCallback(async (questionId: string, answer: string) => {
    setSaveState('saving');
    let lastError: unknown;
    for (let attemptNo = 0; attemptNo < 3; attemptNo += 1) {
      try {
        await apiClient.saveAnswer(attempt._id, questionId, answer);
        pendingAnswers.current.delete(questionId);
        setSaveState('saved');
        return;
      } catch (error) {
        lastError = error;
        if (attemptNo < 2) await new Promise((resolve) => window.setTimeout(resolve, 400 * (attemptNo + 1)));
      }
    }
    setSaveState('error');
    throw lastError;
  }, [attempt._id]);

  function changeAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    pendingAnswers.current.set(questionId, answer);
    const existingTimer = timers.current.get(questionId);
    if (existingTimer) window.clearTimeout(existingTimer);
    const timer = window.setTimeout(() => {
      timers.current.delete(questionId);
      void persistAnswer(questionId, answer).catch(() => undefined);
    }, 350);
    timers.current.set(questionId, timer);
  }

  const flushPendingAnswers = useCallback(async () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
    const pending = Array.from(pendingAnswers.current.entries());
    if (!pending.length) return;
    await Promise.all(pending.map(([questionId, answer]) => persistAnswer(questionId, answer)));
  }, [persistAnswer]);

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await flushPendingAnswers();
      await apiClient.submitAttempt(attempt._id);
      router.replace(`/results/${attempt._id}`);
    } catch {
      setSaveState('error');
      setSubmitting(false);
    }
  }, [attempt._id, flushPendingAnswers, router, submitting]);

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
              return <QuestionRenderer index={index} key={question._id} onChange={changeAnswer} question={question} value={answers[question._id]} />;
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
          {saveState === 'saving' ? 'Dang luu...' : saveState === 'saved' ? 'Da luu' : saveState === 'error' ? 'Luu that bai - vui long thu lai truoc khi nop' : 'Autosave san sang'}
        </p>
        <div className="question-nav">
          {questions.map((question, index) => <span className={answers[question._id] ? 'question-dot answered' : 'question-dot'} key={question._id}>{index + 1}</span>)}
        </div>
      </aside>
    </div>
  );
}
