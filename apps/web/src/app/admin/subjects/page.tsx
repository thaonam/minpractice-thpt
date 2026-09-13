'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { apiClient } from '@/lib/api-client';
import type { Subject } from '@/types/exam';

type ManagedSubject = Subject & { status: 'active' | 'inactive'; order: number };

export default function AdminSubjectsPage() {
  const [items, setItems] = useState<ManagedSubject[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ code: '', name: '', gradeRange: '12', order: '0' });

  async function load() {
    try {
      setItems(await apiClient.adminSubjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong tai duoc mon hoc');
    }
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await apiClient.createSubject({
        code: form.code,
        name: form.name,
        gradeRange: form.gradeRange.split(',').map((item) => item.trim()).filter(Boolean),
        status: 'active',
        order: Number(form.order) || 0,
      });
      setForm({ code: '', name: '', gradeRange: '12', order: '0' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong tao duoc mon hoc');
    }
  }

  return (
    <main className="shell">
      <AppHeader />
      <p className="eyebrow">Admin / Subjects</p>
      <h1>Quan ly mon hoc</h1>
      <div className="admin-layout">
        <section className="card">
          <h2>Them mon hoc</h2>
          <form className="form-stack" onSubmit={submit}>
            <label>Ma mon<input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></label>
            <label>Ten mon<input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Lop<input className="input" value={form.gradeRange} onChange={(e) => setForm({ ...form, gradeRange: e.target.value })} /></label>
            <label>Thu tu<input className="input" type="number" min="0" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></label>
            <button className="btn" type="submit">Tao mon hoc</button>
          </form>
          {error ? <p className="error-text">{error}</p> : null}
        </section>
        <section className="card">
          <h2>Danh sach mon hoc</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Ma</th><th>Ten</th><th>Lop</th><th>Trang thai</th></tr></thead>
              <tbody>{items.map((item) => <tr key={item._id}><td>{item.code}</td><td>{item.name}</td><td>{item.gradeRange.join(', ')}</td><td>{item.status}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
