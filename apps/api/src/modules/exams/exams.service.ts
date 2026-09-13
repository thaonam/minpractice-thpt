import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam } from '../../database/schemas/exam.schema';
import { Question } from '../../database/schemas/question.schema';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  findPublished(subjectId?: string) {
    return this.examModel
      .find({ status: 'published', ...(subjectId ? { subjectId } : {}) })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
  }

  async findPublishedById(id: string) {
    const exam = await this.examModel.findOne({ _id: id, status: 'published' }).lean();
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async findForTaking(id: string) {
    const exam = await this.findPublishedById(id);
    const questionIds = exam.sections.flatMap((section) => section.questionIds);
    const questions = await this.questionModel
      .find({ _id: { $in: questionIds } })
      .select('_id type content options difficulty tags')
      .lean();
    const questionById = new Map(questions.map((question) => [String(question._id), question]));

    return {
      ...exam,
      sections: exam.sections.map((section) => ({
        ...section,
        questions: section.questionIds.map((questionId) => questionById.get(String(questionId))).filter(Boolean),
        questionIds: undefined,
      })),
    };
  }
}
