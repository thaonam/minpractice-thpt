'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { apiClient, AdminQuestion } from '@/lib/api-client';
import type { Subject } from '@/types/exam';

export default function AdminQuestionsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [error, setError] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('A');
  const [options, setOptions] = useState(['', '', '', '']);

  const optionKeys = useMemo(() => ['A', 'B', 'C', 'D'], []);

  async function loadQuestions(filter?: string) {
    try {
      setQuestions(await apiClient.questions(filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong tai duoc cau hoi');
    }
  }

  useEffect(() => {
    apiClient.subjects().then((data) => {
      setSubjects(data);
      if (data[0]) setSubjectId(data[0]._id);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Khong tai duoc mon hoc'));
    void loadQuestions();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await apiClient.createQuestion({
        subjectId,
        type: 'single_choice',
        content,
        options: optionKeys.map((key, index) => ({ key, content: options[index] })),
        correctAnswer: answer,
        difficulty: 'medium',
        tags: [],
      });
      setContent('');
      setOptions(['', '', '', '']);
      await loadQuestions(subjectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong tao duoc cau hoi');
    }
  }

  return (
    <main className="shell">
      <AppHeader />
      <p className="eyebrow">Admin / Question Bank</p>
      <h1>Ngan hang cau hoi</h1>
      <div className="admin-layout">
        <section className="card">
          <h2>Them cau trac nghiem</h2>
          <form className="form-stack" onSubmit={submit}>
            <label>Mon hoc<select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required><option value="">Chon mon</option>{subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}</select></label>
            <label>Noi dung<textarea className="input textarea" value={content} onChange={(e) => setContent(e.target.value)} required /></label>
            {optionKeys.map((key, index) => <label key={key}>Dap an {key}<input className="input" value={options[index]} onChange={(e) => setOptions(options.map((item, i) => i === index ? e.target.value : item))} required /></label>)}
            <label>Dap an dung<select className="input" value={answer} onChange={(e) => setAnswer(e.target.value)}>{optionKeys.map((key) => <option key={key}>{key}</option>)}</select></label>
            <button className="btn" type="submit">Luu cau hoi</button>
          </form>
          {error ? <p className="error-text">{error}</p> : null}
        </section>
        <section className="card">
          <div className="section-row"><h2>Danh sach cau hoi</h2><select className="input compact" onChange={(e) => void loadQuestions(e.target.value || undefined)}><option value="">Tat ca mon</option>{subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}</select></div>
          <div className="question-list">{questions.map((question) => <article className="question-item" key={question._id}><strong>{question.content}</strong><p className="muted">{question.type} · Dap an: {question.correctAnswer}</p></article>)}</div>
        </section>
      </div>
    </main>
  );
}
