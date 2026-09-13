'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { AdminExam, AdminQuestion, apiClient, ExamSectionPayload } from '@/lib/api-client';
import type { Subject } from '@/types/exam';

const emptySection = (): ExamSectionPayload => ({ title: 'Phan 1', description: '', questionIds: [] });

export default function AdminExamsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('12');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [totalScore, setTotalScore] = useState(10);
  const [sections, setSections] = useState<ExamSectionPayload[]>([emptySection()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredQuestions = useMemo(
    () => questions.filter((question) => !subjectId || question.subjectId === subjectId),
    [questions, subjectId],
  );

  async function loadAll() {
    setError('');
    try {
      const [subjectData, questionData, examData] = await Promise.all([
        apiClient.subjects(),
        apiClient.questions(),
        apiClient.adminExams(),
      ]);
      setSubjects(subjectData);
      setQuestions(questionData);
      setExams(examData);
      if (!subjectId && subjectData[0]) setSubjectId(subjectData[0]._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong tai duoc du lieu Exam Builder');
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function resetForm() {
    setSelectedExamId(null);
    setTitle('');
    setGrade('12');
    setDurationMinutes(90);
    setTotalScore(10);
    setSections([emptySection()]);
    if (subjects[0]) setSubjectId(subjects[0]._id);
  }

  async function editExam(exam: AdminExam) {
    setError('');
    try {
      const full = await apiClient.adminExam(exam._id);
      setSelectedExamId(full._id);
      setSubjectId(full.subjectId);
      setTitle(full.title);
      setGrade(full.grade);
      setDurationMinutes(full.durationMinutes);
      setTotalScore(full.totalScore);
      setSections(full.sections.length ? full.sections : [emptySection()]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong mo duoc de thi');
    }
  }

  function updateSection(index: number, patch: Partial<ExamSectionPayload>) {
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  }

  function toggleQuestion(sectionIndex: number, questionId: string) {
    const current = sections[sectionIndex].questionIds;
    const next = current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId];
    updateSection(sectionIndex, { questionIds: next });
  }

  function moveQuestion(sectionIndex: number, questionIndex: number, direction: -1 | 1) {
    const ids = [...sections[sectionIndex].questionIds];
    const target = questionIndex + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[questionIndex], ids[target]] = [ids[target], ids[questionIndex]];
    updateSection(sectionIndex, { questionIds: ids });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        subjectId,
        title,
        examType: 'thpt_graduation',
        grade,
        durationMinutes,
        totalScore,
        status: 'draft' as const,
        sections,
      };
      if (selectedExamId) {
        await apiClient.updateExam(selectedExamId, payload);
      } else {
        const created = await apiClient.createExam(payload);
        setSelectedExamId(created._id);
      }
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong luu duoc de thi');
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (!selectedExamId) return;
    setError('');
    try {
      await apiClient.publishExam(selectedExamId);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Khong publish duoc de thi');
    }
  }

  return (
    <main className="shell">
      <AppHeader />
      <div className="section-row">
        <div>
          <p className="eyebrow">Admin / Exam Builder</p>
          <h1>Quan ly de thi</h1>
        </div>
        <button className="btn secondary" type="button" onClick={resetForm}>Tao de moi</button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-layout wide">
        <section className="card">
          <h2>{selectedExamId ? 'Chinh sua de thi' : 'Tao de thi moi'}</h2>
          <form className="form-stack" onSubmit={save}>
            <label>Mon hoc<select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>{subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}</select></label>
            <label>Tieu de<input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
            <div className="form-grid-3">
              <label>Lop<input className="input" value={grade} onChange={(e) => setGrade(e.target.value)} required /></label>
              <label>Thoi gian (phut)<input className="input" type="number" min="1" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} /></label>
              <label>Tong diem<input className="input" type="number" min="0" step="0.25" value={totalScore} onChange={(e) => setTotalScore(Number(e.target.value))} /></label>
            </div>

            <div className="section-row"><h3>Cau truc de</h3><button className="btn secondary" type="button" onClick={() => setSections((current) => [...current, { ...emptySection(), title: `Phan ${current.length + 1}` }])}>Them phan</button></div>

            {sections.map((section, sectionIndex) => (
              <div className="exam-section-editor" key={`${section.title}-${sectionIndex}`}>
                <div className="section-row">
                  <strong>Phan {sectionIndex + 1}</strong>
                  {sections.length > 1 ? <button className="text-button danger" type="button" onClick={() => setSections((current) => current.filter((_, i) => i !== sectionIndex))}>Xoa phan</button> : null}
                </div>
                <label>Tieu de phan<input className="input" value={section.title} onChange={(e) => updateSection(sectionIndex, { title: e.target.value })} required /></label>
                <label>Mo ta<textarea className="input textarea small" value={section.description ?? ''} onChange={(e) => updateSection(sectionIndex, { description: e.target.value })} /></label>

                <div className="question-picker">
                  <p className="muted"><strong>Chon cau hoi</strong> · {section.questionIds.length} cau</p>
                  {filteredQuestions.map((question) => (
                    <label className="question-pick-row" key={question._id}>
                      <input type="checkbox" checked={section.questionIds.includes(question._id)} onChange={() => toggleQuestion(sectionIndex, question._id)} />
                      <span>{question.content}</span>
                    </label>
                  ))}
                  {!filteredQuestions.length ? <p className="muted">Chua co cau hoi cho mon nay. <Link href="/admin/questions">Tao cau hoi truoc</Link>.</p> : null}
                </div>

                {section.questionIds.length ? (
                  <div>
                    <p className="muted"><strong>Thu tu cau hoi</strong></p>
                    {section.questionIds.map((questionId, index) => {
                      const question = questions.find((item) => item._id === questionId);
                      return (
                        <div className="ordered-question" key={questionId}>
                          <span>{index + 1}. {question?.content ?? questionId}</span>
                          <span className="order-actions">
                            <button type="button" className="text-button" onClick={() => moveQuestion(sectionIndex, index, -1)}>↑</button>
                            <button type="button" className="text-button" onClick={() => moveQuestion(sectionIndex, index, 1)}>↓</button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="button-row">
              <button className="btn" type="submit" disabled={saving}>{saving ? 'Dang luu...' : 'Luu Draft'}</button>
              {selectedExamId ? <button className="btn secondary" type="button" onClick={publish}>Publish</button> : null}
            </div>
          </form>
        </section>

        <section className="card">
          <h2>Danh sach de thi</h2>
          <div className="question-list">
            {exams.map((exam) => (
              <article className="question-item" key={exam._id}>
                <div className="section-row">
                  <strong>{exam.title}</strong>
                  <span className={exam.status === 'published' ? 'badge success' : 'badge'}>{exam.status}</span>
                </div>
                <p className="muted">Lop {exam.grade} · {exam.durationMinutes} phut · {exam.sections?.reduce((sum, section) => sum + section.questionIds.length, 0) ?? 0} cau</p>
                <div className="button-row">
                  <button className="btn secondary" type="button" onClick={() => void editExam(exam)}>Sua</button>
                  {exam.status === 'published' ? <Link className="btn secondary" href={`/exams/${exam._id}`}>Xem de</Link> : null}
                </div>
              </article>
            ))}
            {!exams.length ? <p className="muted">Chua co de thi nao.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
