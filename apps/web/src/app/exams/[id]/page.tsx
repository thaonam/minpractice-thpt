'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { apiClient, authStorage } from '@/lib/api-client';
import type { Exam } from '@/types/exam';

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    apiClient.exam(params.id)
      .then(setExam)
      .catch((err) => setError(err instanceof Error ? err.message : 'Khong tim thay de'));
  }, [params.id]);

  async function start() {
    if (!authStorage.user()) {
      router.push(`/login?next=/exams/${params.id}`);
      return;
    }

    setStarting(true);
    setError('');
    try {
      const attempt = await apiClient.startAttempt(params.id);
      router.push(`/take-test/${attempt._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong bat dau duoc bai thi');
      setStarting(false);
    }
  }

  return (
    <main className="shell">
      <AppHeader />
      {error ? <p className="error-text">{error}</p> : null}
      {!exam ? <p className="muted">Dang tai de thi...</p> : (
        <div className="card">
          <p className="muted">Lop {exam.grade}</p>
          <h1>{exam.title}</h1>
          <p>Thoi gian: {exam.durationMinutes} phut</p>
          <p>Tong diem: {exam.totalScore}</p>
          <button className="btn" type="button" onClick={() => void start()} disabled={starting}>
            {starting ? 'Dang khoi tao...' : 'Bat dau lam bai'}
          </button>
        </div>
      )}
    </main>
  );
}
