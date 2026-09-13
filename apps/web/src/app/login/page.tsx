'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { apiClient, authStorage } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.login(email, password);
      authStorage.save(response);
      router.push(response.user.role === 'student' ? '/' : '/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dang nhap that bai');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <AppHeader />
      <section className="auth-card card">
        <p className="eyebrow">MinPractice account</p>
        <h1>Dang nhap</h1>
        <p className="muted">Dang nhap de quan ly noi dung hoac luu lich su luyen de.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>
            Email
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Mat khau
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Dang xu ly...' : 'Dang nhap'}
          </button>
        </form>
      </section>
    </main>
  );
}
