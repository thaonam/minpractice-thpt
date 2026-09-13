'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { apiClient, authStorage } from '@/lib/api-client';
import type { Attempt, TakeExam } from '@/types/exam';
import { TakeTestClient } from './take-test-client';

export default function TakeTestPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [exam, setExam] = useState<TakeExam | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.user()) {
      router.replace(`/login?next=/take-test/${params.attemptId}`);
      return;
    }

    apiClient.attempt(params.attemptId)
      .then(async (attemptData) => {
        if (attemptData.status !== 'in_progress') {
          router.replace(`/results/${attemptData._id}`);
          return;
        }
        const examData = await apiClient.takeExam(attemptData.examId);
        setAttempt(attemptData);
        setExam(examData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Khong tai duoc bai thi'));
  }, [params.attemptId, router]);

  return (
    <main className="shell">
      <AppHeader />
      {error ? <p className="error-text">{error}</p> : null}
      {!attempt || !exam ? <p className="muted">Dang tai bai thi...</p> : (
        <>
          <p className="eyebrow">Dang lam bai</p>
          <h1>{exam.title}</h1>
          <TakeTestClient attempt={attempt} exam={exam} />
        </>
      )}
    </main>
  );
}
