import type { Attempt, Exam, Subject } from '@/types/exam';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  subjects: () => request<Subject[]>('/subjects'),
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
