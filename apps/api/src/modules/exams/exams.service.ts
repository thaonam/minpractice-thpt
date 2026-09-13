import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: UpsertExamDto) {
    if (dto.status === 'published') throw new BadRequestException('Use the publish endpoint to publish an exam');
    await this.validateQuestionReferences(dto);
    return this.examModel.create({ ...this.mapDto(dto), status: 'draft', publishedAt: undefined });
  }

  async update(id: string, dto: UpsertExamDto) {
    const current = await this.examModel.findById(id).lean();
    if (!current) throw new NotFoundException('Exam not found');
    if (current.status !== 'draft') throw new BadRequestException('Only draft exams can be edited');
    if (dto.status === 'published') throw new BadRequestException('Use the publish endpoint to publish an exam');

    await this.validateQuestionReferences(dto);
    const exam = await this.examModel.findByIdAndUpdate(
      id,
      { ...this.mapDto(dto), status: 'draft', publishedAt: undefined },
      { new: true, runValidators: true },
    );
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async publish(id: string) {
    const exam = await this.examModel.findById(id).lean();
    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.status === 'published') return exam;
    if (exam.status !== 'draft') throw new BadRequestException('Only draft exams can be published');

    const dto: UpsertExamDto = {
      subjectId: String(exam.subjectId),
      title: exam.title,
      examType: exam.examType,
      grade: exam.grade,
      durationMinutes: exam.durationMinutes,
      totalScore: exam.totalScore,
      status: 'draft',
      sections: exam.sections.map((section) => ({
        title: section.title,
        description: section.description,
        questionIds: section.questionIds.map(String),
      })),
    };

    this.validatePublishShape(dto);
    await this.validateQuestionReferences(dto);

    return this.examModel.findByIdAndUpdate(
      id,
      { status: 'published', publishedAt: new Date() },
      { new: true, runValidators: true },
    );
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

  private validatePublishShape(dto: UpsertExamDto) {
    if (!dto.title.trim()) throw new BadRequestException('Exam title is required');
    if (!dto.sections.length) throw new BadRequestException('Exam must have at least one section');
    if (dto.sections.some((section) => !section.title.trim())) throw new BadRequestException('Every exam section must have a title');
    if (dto.sections.some((section) => section.questionIds.length === 0)) throw new BadRequestException('Every exam section must contain at least one question');
  }

  private async validateQuestionReferences(dto: UpsertExamDto) {
    const questionIds = dto.sections.flatMap((section) => section.questionIds);
    if (!questionIds.length) return;

    const uniqueIds = new Set(questionIds);
    if (uniqueIds.size !== questionIds.length) throw new BadRequestException('The same question cannot appear more than once in an exam');

    const questions = await this.questionModel.find({ _id: { $in: questionIds } }).select('_id subjectId').lean();
    if (questions.length !== questionIds.length) throw new BadRequestException('One or more questions do not exist');
    if (questions.some((question) => String(question.subjectId) !== dto.subjectId)) {
      throw new BadRequestException('All questions in an exam must belong to the selected subject');
    }
  }

  private mapDto(dto: UpsertExamDto) {
    return {
      ...dto,
      subjectId: new Types.ObjectId(dto.subjectId),
      sections: dto.sections.map((section) => ({
        ...section,
        title: section.title.trim(),
        description: section.description?.trim(),
        questionIds: section.questionIds.map((id) => new Types.ObjectId(id)),
      })),
    };
  }
}
