'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { ExamCard } from '@/components/exam-card';
import { apiClient } from '@/lib/api-client';
import type { Exam, Subject } from '@/types/exam';

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiClient.subjects(), apiClient.exams()])
      .then(([subjectData, examData]) => {
        setSubjects(subjectData);
        setExams(examData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Khong tai duoc du lieu'));
  }, []);

  return (
    <main className="shell">
      <AppHeader />
      <section>
        <p className="eyebrow">MinPractice</p>
        <h1>He thong luyen de THPT</h1>
        <p className="muted">Chon mon hoc, vao de thi da publish va luu lai lich su bai lam cua ban.</p>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="grid" style={{ marginTop: 24 }}>
        {subjects.map((subject) => (
          <div className="card" key={subject._id}>
            <strong>{subject.name}</strong>
            <p className="muted">Khoi/lop: {subject.gradeRange.join(', ')}</p>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>De luyen tap</h2>
        <div className="grid">
          {exams.map((exam) => <ExamCard exam={exam} key={exam._id} />)}
          {!exams.length && !error ? <p className="muted">Chua co de thi duoc publish.</p> : null}
        </div>
      </section>
    </main>
  );
}
