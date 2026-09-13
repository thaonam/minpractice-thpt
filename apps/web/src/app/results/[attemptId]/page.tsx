'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { apiClient, authStorage } from '@/lib/api-client';
import type { AttemptResult } from '@/types/exam';

export default function ResultPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authStorage.user()) {
      router.replace(`/login?next=/results/${params.attemptId}`);
      return;
    }

    apiClient.attemptResult(params.attemptId)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Khong tai duoc ket qua'));
  }, [params.attemptId, router]);

  return (
    <main className="shell">
      <AppHeader />
      {error ? <p className="error-text">{error}</p> : null}
      {!result ? <p className="muted">Dang tai ket qua...</p> : (
        <>
          <section className="card result-summary">
            <p className="eyebrow">Ket qua bai lam</p>
            <h1>{result.score.toFixed(2)} diem</h1>
            <div className="result-stats">
              <div><strong>{result.correctCount}</strong><span>Dung</span></div>
              <div><strong>{result.wrongCount}</strong><span>Sai</span></div>
              <div><strong>{result.blankCount}</strong><span>Bo trong</span></div>
              <div><strong>{result.totalQuestions}</strong><span>Tong cau</span></div>
            </div>
          </section>

          <section style={{ marginTop: 20 }}>
            <h2>Chi tiet dap an</h2>
            <div className="question-list">
              {result.details.map((detail, index) => (
                <article className="card result-detail" key={detail.questionId}>
                  <div className="section-row">
                    <strong>Cau {index + 1}</strong>
                    <span className={detail.isCorrect ? 'badge success' : 'badge'}>{detail.isCorrect ? 'Dung' : 'Sai'}</span>
                  </div>
                  {detail.content ? <p>{detail.content}</p> : null}
                  <p><strong>Ban chon:</strong> {detail.userAnswer || 'Bo trong'}</p>
                  <p><strong>Dap an dung:</strong> {detail.correctAnswer}</p>
                  {detail.explanation ? <p className="muted"><strong>Giai thich:</strong> {detail.explanation}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <div className="button-row" style={{ marginTop: 20 }}>
            <Link className="btn secondary" href="/">Ve danh sach de</Link>
            <Link className="btn secondary" href="/history">Lich su bai lam</Link>
          </div>
        </>
      )}
    </main>
  );
}
