import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attempt } from '../../database/schemas/attempt.schema';
import { AttemptResult } from '../../database/schemas/attempt-result.schema';
import { Exam } from '../../database/schemas/exam.schema';
import { Question } from '../../database/schemas/question.schema';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { GradingService } from './grading.service';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(Attempt.name) private readonly attemptModel: Model<Attempt>,
    @InjectModel(AttemptResult.name) private readonly attemptResultModel: Model<AttemptResult>,
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private readonly gradingService: GradingService,
  ) {}

  async start(examId: string, userId: string) {
    const exam = await this.examModel.findOne({ _id: examId, status: 'published' }).lean();
    if (!exam) throw new NotFoundException('Exam not found');

    const userObjectId = new Types.ObjectId(userId);
    const existing = await this.attemptModel.findOne({
      examId: new Types.ObjectId(examId),
      userId: userObjectId,
      status: 'in_progress',
      expiresAt: { $gt: new Date() },
    });
    if (existing) return existing;

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + exam.durationMinutes * 60 * 1000);

    return this.attemptModel.create({
      userId: userObjectId,
      examId: new Types.ObjectId(examId),
      status: 'in_progress',
      startedAt,
      expiresAt,
      answers: [],
    });
  }

  history(userId: string) {
    return this.attemptModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(100).lean();
  }

  async findOne(id: string, userId: string) {
    const attempt = await this.attemptModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).lean();
    if (!attempt) throw new NotFoundException('Attempt not found');
    return attempt;
  }

  async saveAnswer(id: string, dto: SaveAnswerDto, userId: string) {
    const attempt = await this.attemptModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'in_progress') throw new BadRequestException('Attempt is already submitted');
    if (attempt.expiresAt.getTime() < Date.now()) {
      await this.gradeAndFinalize(attempt, true);
      throw new BadRequestException('Attempt is expired and has been submitted');
    }

    const questionId = new Types.ObjectId(dto.questionId);
    const existingAnswer = attempt.answers.find((item) => String(item.questionId) === dto.questionId);
    if (existingAnswer) {
      existingAnswer.answer = dto.answer;
      existingAnswer.answeredAt = new Date();
    } else {
      attempt.answers.push({ questionId, answer: dto.answer, answeredAt: new Date() });
    }
    return attempt.save();
  }

  async submit(id: string, userId: string) {
    const attempt = await this.attemptModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status === 'submitted' || attempt.status === 'expired') return attempt;
    return this.gradeAndFinalize(attempt, attempt.expiresAt.getTime() < Date.now());
  }

  async result(id: string, userId: string) {
    const attempt = await this.attemptModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).lean();
    if (!attempt) throw new NotFoundException('Attempt not found');

    if (attempt.status === 'in_progress' && new Date(attempt.expiresAt).getTime() < Date.now()) {
      const editable = await this.attemptModel.findById(id);
      if (editable) await this.gradeAndFinalize(editable, true);
    }

    const result = await this.attemptResultModel.findOne({ attemptId: id, userId: new Types.ObjectId(userId) }).lean();
    if (!result) throw new NotFoundException('Attempt result not found');
    return result;
  }

  private async gradeAndFinalize(attempt: any, expired: boolean) {
    const exam = await this.examModel.findById(attempt.examId).lean();
    if (!exam) throw new NotFoundException('Exam not found');

    const questionIds = exam.sections.flatMap((section) => section.questionIds);
    const questions = await this.questionModel.find({ _id: { $in: questionIds } }).lean();
    const result = this.gradingService.grade(questions, attempt.answers);

    attempt.status = expired ? 'expired' : 'submitted';
    attempt.submittedAt = new Date();
    attempt.score = result.score;
    attempt.correctCount = result.correctCount;
    attempt.wrongCount = result.wrongCount;
    attempt.blankCount = result.blankCount;
    await attempt.save();

    await this.attemptResultModel.updateOne(
      { attemptId: attempt._id },
      {
        $set: {
          attemptId: attempt._id,
          userId: attempt.userId,
          examId: attempt.examId,
          score: result.score,
          totalQuestions: questions.length,
          correctCount: result.correctCount,
          wrongCount: result.wrongCount,
          blankCount: result.blankCount,
          details: result.details,
        },
      },
      { upsert: true },
    );

    return attempt;
  }
}
