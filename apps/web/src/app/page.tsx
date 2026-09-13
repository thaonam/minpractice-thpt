import { AppHeader } from '@/components/app-header';
import { ExamCard } from '@/components/exam-card';
import { mockExams, mockSubjects } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <main className="shell">
      <AppHeader />
      <section>
        <p className="muted">Next.js frontend skeleton</p>
        <h1>He thong luyen de THPT</h1>
        <p className="muted">
          Ban tiep theo se noi NestJS API, MongoDB, login, autosave va lich su bai lam.
        </p>
      </section>

      <section className="grid" style={{ marginTop: 24 }}>
        {mockSubjects.map((subject) => (
          <div className="card" key={subject._id}>
            <strong>{subject.name}</strong>
            <p className="muted">Khoi/lop: {subject.gradeRange.join(', ')}</p>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>De luyen tap</h2>
        <div className="grid">
          {mockExams.map((exam) => (
            <ExamCard exam={exam} key={exam._id} />
          ))}
        </div>
      </section>
    </main>
  );
}
