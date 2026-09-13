import { Injectable } from '@nestjs/common';

export interface GradeQuestion {
  _id: unknown;
  content?: string;
  correctAnswer: string;
  explanation?: string;
}

export interface GradeAnswer {
  questionId: unknown;
  answer?: string;
}

@Injectable()
export class GradingService {
  grade(questions: GradeQuestion[], answers: GradeAnswer[]) {
    const answerByQuestion = new Map(answers.map((item) => [String(item.questionId), item.answer]));
    let correctCount = 0;
    let wrongCount = 0;
    let blankCount = 0;

    const details = questions.map((question) => {
      const userAnswer = answerByQuestion.get(String(question._id));
      const isBlank = !userAnswer;
      const isCorrect = !isBlank && userAnswer === question.correctAnswer;

      if (isBlank) {
        blankCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }

      return {
        questionId: question._id,
        content: question.content,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    return {
      score: questions.length ? Number(((correctCount / questions.length) * 10).toFixed(2)) : 0,
      correctCount,
      wrongCount,
      blankCount,
      details,
    };
  }
}
