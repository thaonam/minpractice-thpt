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

export interface QuestionOption {
  key: string;
  content: string;
}

export interface TakeQuestion {
  _id: string;
  type: 'single_choice' | 'true_false' | 'short_answer';
  content: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface TakeSection {
  title: string;
  description?: string;
  questions: TakeQuestion[];
}

export interface TakeExam extends Exam {
  sections: TakeSection[];
}

export interface AttemptAnswer {
  questionId: string;
  answer?: string;
  answeredAt?: string;
}

export interface Attempt {
  _id: string;
  userId?: string;
  examId: string;
  status: 'in_progress' | 'submitted' | 'expired';
  startedAt: string;
  submittedAt?: string;
  expiresAt: string;
  answers?: AttemptAnswer[];
  score?: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
}

export interface AttemptResultDetail {
  questionId: string;
  content?: string;
  userAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface AttemptResult {
  _id: string;
  attemptId: string;
  examId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  details: AttemptResultDetail[];
}
