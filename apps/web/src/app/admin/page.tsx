import Link from 'next/link';
import { AppHeader } from '@/components/app-header';

const modules = [
  { name: 'Subjects', description: 'Quan ly mon hoc va khoi lop.', href: '/admin/subjects', ready: true },
  { name: 'Question Bank', description: 'Tao va loc ngan hang cau hoi.', href: '/admin/questions', ready: true },
  { name: 'Exams', description: 'Exam Builder, section, preview va publish.', href: '#', ready: false },
  { name: 'Users', description: 'Quan ly tai khoan va role.', href: '#', ready: false },
  { name: 'Analytics', description: 'Thong ke ket qua va luot thi.', href: '#', ready: false },
];

export default function AdminPage() {
  return (
    <main className="shell">
      <AppHeader />
      <p className="eyebrow">Content Management</p>
      <h1>Admin CMS</h1>
      <p className="muted">Quan ly noi dung MinPractice tu MongoDB thong qua NestJS API.</p>
      <div className="grid admin-grid">
        {modules.map((module) => (
          <div className="card" key={module.name}>
            <div className="section-row"><h2>{module.name}</h2><span className={module.ready ? 'badge success' : 'badge'}>{module.ready ? 'Ready' : 'Next'}</span></div>
            <p className="muted">{module.description}</p>
            {module.ready ? <Link className="btn secondary" href={module.href}>Mo module</Link> : null}
          </div>
        ))}
      </div>
    </main>
  );
}
