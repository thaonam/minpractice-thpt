export interface Subject {
  _id: string;
  code: string;
  name: string;
  gradeRange: string[];
}

export interface Exam {
  _id: string;
  subjectId: string;
  title: string;
  grade: string;
  durationMinutes: number;
  totalScore: number;
  status: 'draft' | 'published' | 'archived';
}

export interface Attempt {
  _id: string;
  examId: string;
  status: 'in_progress' | 'submitted' | 'expired';
  startedAt: string;
  expiresAt: string;
  score?: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
}
