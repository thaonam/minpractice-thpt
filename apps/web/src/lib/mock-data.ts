import type { Exam, Subject } from '@/types/exam';

export const mockSubjects: Subject[] = [
  { _id: 'math', code: 'math', name: 'Toan', gradeRange: ['12'] },
  { _id: 'english', code: 'english', name: 'Tieng Anh', gradeRange: ['12'] },
  { _id: 'physics', code: 'physics', name: 'Vat ly', gradeRange: ['12'] },
];

export const mockExams: Exam[] = [
  {
    _id: 'demo-math-01',
    subjectId: 'math',
    title: 'De thi thu THPT 2026 - Mon Toan - De 01',
    grade: '12',
    durationMinutes: 90,
    totalScore: 10,
    status: 'published',
  },
  {
    _id: 'demo-english-01',
    subjectId: 'english',
    title: 'De thi thu THPT 2026 - Mon Tieng Anh - De 01',
    grade: '12',
    durationMinutes: 60,
    totalScore: 10,
    status: 'published',
  },
];
