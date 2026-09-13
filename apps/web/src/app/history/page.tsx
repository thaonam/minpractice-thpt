'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { apiClient, authStorage } from '@/lib/api-client';
import type { Attempt, Exam } from '@/types/exam';

export default function HistoryPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [examMap, setExamMap] = useState<Record<string, Exam>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.user()) {
      router.replace('/login?next=/history');
      return;
    }

    apiClient.attemptHistory()
      .then(async (data) => {
        setAttempts(data);
        const ids = Array.from(new Set(data.map((attempt) => attempt.examId)));
        const entries = await Promise.all(ids.map(async (id) => {
          try {
            return [id, await apiClient.exam(id)] as const;
          } catch {
            return null;
          }
        }));
        setExamMap(Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, Exam]>));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Khong tai duoc lich su'));
  }, [router]);

  return (
    <main className="shell">
      <AppHeader />
      <p className="eyebrow">Tai khoan hoc vien</p>
      <h1>Lich su bai lam</h1>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="question-list">
        {attempts.map((attempt) => {
          const exam = examMap[attempt.examId];
          return (
            <article className="card" key={attempt._id}>
              <div className="section-row">
                <div>
                  <strong>{exam?.title ?? `De thi ${attempt.examId}`}</strong>
                  <p className="muted">Bat dau: {new Date(attempt.startedAt).toLocaleString('vi-VN')}</p>
                </div>
                <span className={attempt.status === 'submitted' ? 'badge success' : 'badge'}>{attempt.status}</span>
              </div>
              <p>{attempt.score !== undefined ? `Diem: ${attempt.score.toFixed(2)}` : 'Chua co diem'}</p>
              <div className="button-row">
                {attempt.status === 'in_progress' ? <Link className="btn secondary" href={`/take-test/${attempt._id}`}>Tiep tuc lam</Link> : null}
                {attempt.status !== 'in_progress' ? <Link className="btn secondary" href={`/results/${attempt._id}`}>Xem ket qua</Link> : null}
              </div>
            </article>
          );
        })}
        {!attempts.length && !error ? <p className="muted">Ban chua co bai lam nao.</p> : null}
      </div>
    </main>
  );
}
