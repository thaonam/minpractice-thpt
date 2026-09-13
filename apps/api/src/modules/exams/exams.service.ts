import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exam } from '../../database/schemas/exam.schema';
import { Question } from '../../database/schemas/question.schema';
import { UpsertExamDto } from './dto/upsert-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  findPublished(subjectId?: string) {
    return this.examModel.find({ status: 'published', ...(subjectId ? { subjectId } : {}) }).sort({ publishedAt: -1, createdAt: -1 }).lean();
  }

  findAll() {
    return this.examModel.find().sort({ createdAt: -1 }).lean();
  }

  async findPublishedById(id: string) {
    const exam = await this.examModel.findOne({ _id: id, status: 'published' }).lean();
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async findAdminById(id: string) {
    const exam = await this.examModel.findById(id).lean();
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  create(dto: UpsertExamDto) {
    return this.examModel.create(this.mapDto(dto));
  }

  async update(id: string, dto: UpsertExamDto) {
    const exam = await this.examModel.findByIdAndUpdate(id, this.mapDto(dto), { new: true, runValidators: true });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async publish(id: string) {
    const exam = await this.examModel.findByIdAndUpdate(id, { status: 'published', publishedAt: new Date() }, { new: true });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async findForTaking(id: string) {
    const exam = await this.findPublishedById(id);
    const questionIds = exam.sections.flatMap((section) => section.questionIds);
    const questions = await this.questionModel.find({ _id: { $in: questionIds } }).select('_id type content options difficulty tags').lean();
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

  private mapDto(dto: UpsertExamDto) {
    return {
      ...dto,
      subjectId: new Types.ObjectId(dto.subjectId),
      sections: dto.sections.map((section) => ({
        ...section,
        questionIds: section.questionIds.map((id) => new Types.ObjectId(id)),
      })),
    };
  }
}
