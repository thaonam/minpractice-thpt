import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="mark">MP</span>
        <span>
          <strong>MinPractice THPT</strong>
          <br />
          <span className="muted">Luyen de theo workflow that</span>
        </span>
      </Link>
      <nav>
        <Link className="btn secondary" href="/admin">
          Admin
        </Link>
      </nav>
    </header>
  );
}
