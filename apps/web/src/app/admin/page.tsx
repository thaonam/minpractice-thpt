import { AppHeader } from '@/components/app-header';

const modules = ['Subjects', 'Exams', 'Questions', 'Imports', 'Users', 'Analytics'];

export default function AdminPage() {
  return (
    <main className="shell">
      <AppHeader />
      <h1>Admin CMS</h1>
      <p className="muted">Khu quan tri se quan ly mon hoc, de thi, cau hoi, import va publish.</p>
      <div className="grid">
        {modules.map((module) => (
          <div className="card" key={module}>
            <h2>{module}</h2>
            <p className="muted">Module skeleton</p>
          </div>
        ))}
      </div>
    </main>
  );
}
