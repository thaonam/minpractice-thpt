import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { mockExams } from '@/lib/mock-data';

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const exam = mockExams.find((item) => item._id === params.id);

  if (!exam) {
    return (
      <main className="shell">
        <AppHeader />
        <h1>Khong tim thay de</h1>
      </main>
    );
  }

  return (
    <main className="shell">
      <AppHeader />
      <div className="card">
        <p className="muted">Lop {exam.grade}</p>
        <h1>{exam.title}</h1>
        <p>Thoi gian: {exam.durationMinutes} phut</p>
        <p>Tong diem: {exam.totalScore}</p>
        <Link className="btn" href={`/take-test/${exam._id}`}>
          Bat dau lam bai
        </Link>
      </div>
    </main>
  );
}
