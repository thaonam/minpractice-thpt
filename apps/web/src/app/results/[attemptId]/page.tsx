import Link from 'next/link';
import { AppHeader } from '@/components/app-header';

export default function ResultPage({ params }: { params: { attemptId: string } }) {
  return (
    <main className="shell">
      <AppHeader />
      <div className="card">
        <p className="muted">Attempt/demo: {params.attemptId}</p>
        <h1>Ket qua bai lam</h1>
        <p>Diem demo: 8.0 / 10</p>
        <p className="muted">Ban NestJS se tra ve diem that, so cau dung/sai/bo trong va giai thich.</p>
        <Link className="btn secondary" href="/">
          Ve danh sach de
        </Link>
      </div>
    </main>
  );
}
