import Link from 'next/link';
import type { Exam } from '@/types/exam';

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <article className="card">
      <p className="muted">Lop {exam.grade} - {exam.durationMinutes} phut</p>
      <h2>{exam.title}</h2>
      <p className="muted">Tong diem: {exam.totalScore}</p>
      <Link className="btn" href={`/exams/${exam._id}`}>
        Xem de
      </Link>
    </article>
  );
}
