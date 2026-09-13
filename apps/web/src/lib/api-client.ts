import type { Attempt, Exam, Subject } from '@/types/exam';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'content_editor';
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface QuestionPayload {
  subjectId: string;
  type: 'single_choice' | 'true_false' | 'short_answer';
  content: string;
  options: Array<{ key: string; content: string }>;
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface AdminQuestion extends QuestionPayload {
  _id: string;
}

function getToken() {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage.getItem('minpractice_access_token') ?? undefined;
}

async function request<T>(path: string, init?: RequestInit, authenticated = false): Promise<T> {
  const token = authenticated ? getToken() : undefined;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message;
    throw new Error(Array.isArray(message) ? message.join(', ') : message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const authStorage = {
  save(response: AuthResponse) {
    window.localStorage.setItem('minpractice_access_token', response.accessToken);
    window.localStorage.setItem('minpractice_user', JSON.stringify(response.user));
  },
  clear() {
    window.localStorage.removeItem('minpractice_access_token');
    window.localStorage.removeItem('minpractice_user');
  },
  user(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('minpractice_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
};

export const apiClient = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => request<AuthUser>('/auth/me', undefined, true),

  subjects: () => request<Subject[]>('/subjects'),
  adminSubjects: () => request<Array<Subject & { status: 'active' | 'inactive'; order: number }>>('/subjects/admin/all', undefined, true),
  createSubject: (payload: Omit<Subject, '_id'> & { status?: 'active' | 'inactive'; order?: number }) =>
    request<Subject>('/subjects', { method: 'POST', body: JSON.stringify(payload) }, true),

  questions: (subjectId?: string) =>
    request<AdminQuestion[]>(subjectId ? `/questions?subjectId=${subjectId}` : '/questions'),
  createQuestion: (payload: QuestionPayload) =>
    request<AdminQuestion>('/questions', { method: 'POST', body: JSON.stringify(payload) }, true),

  exams: (subjectId?: string) => request<Exam[]>(subjectId ? `/exams?subjectId=${subjectId}` : '/exams'),
  exam: (id: string) => request<Exam>(`/exams/${id}`),
  startAttempt: (examId: string) => request<Attempt>(`/exams/${examId}/attempts`, { method: 'POST' }),
  saveAnswer: (attemptId: string, questionId: string, answer?: string) =>
    request<Attempt>(`/attempts/${attemptId}/answers`, {
      method: 'PATCH',
      body: JSON.stringify({ questionId, answer }),
    }),
  submitAttempt: (attemptId: string) => request<Attempt>(`/attempts/${attemptId}/submit`, { method: 'POST' }),
};
