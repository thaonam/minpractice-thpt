import Link from 'next/link';
import { AppHeader } from '@/components/app-header';

const demoQuestions = [
  {
    id: 'q1',
    content: 'Neu x + y = 10 va x - y = 4, gia tri cua x la bao nhieu?',
    options: ['3', '5', '7', '10'],
  },
  {
    id: 'q2',
    content: 'Ham so f(x) = 2x^2 - 3x + 1. Gia tri f(-2) la bao nhieu?',
    options: ['15', '12', '9', '3'],
  },
];

export default function TakeTestPage({ params }: { params: { attemptId: string } }) {
  return (
    <main className="shell">
      <AppHeader />
      <p className="muted">Attempt/demo: {params.attemptId}</p>
      <h1>Lam bai thi</h1>
      <div className="grid">
        <section>
          {demoQuestions.map((question, index) => (
            <article className="card" key={question.id} style={{ marginBottom: 16 }}>
              <h2>Cau {index + 1}</h2>
              <p>{question.content}</p>
              {question.options.map((option) => (
                <label key={option} style={{ display: 'block', marginTop: 10 }}>
                  <input name={question.id} type="radio" /> {option}
                </label>
              ))}
            </article>
          ))}
          <Link className="btn" href={`/results/${params.attemptId}`}>
            Nop bai
          </Link>
        </section>
        <aside className="card">
          <h2>Bang cau hoi</h2>
          <p className="muted">Sau khi noi API, khu vuc nay se hien timer va autosave status.</p>
        </aside>
      </div>
    </main>
  );
}
