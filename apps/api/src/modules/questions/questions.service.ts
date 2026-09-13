import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exam } from '../../database/schemas/exam.schema';
import { Question } from '../../database/schemas/question.schema';
import { UpsertQuestionDto } from './dto/upsert-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
  ) {}

  list(subjectId?: string) {
    const query = subjectId ? { subjectId: new Types.ObjectId(subjectId) } : {};
    return this.questionModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const question = await this.questionModel.findById(id).lean();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  create(dto: UpsertQuestionDto) {
    return this.questionModel.create({ ...dto, subjectId: new Types.ObjectId(dto.subjectId) });
  }

  async update(id: string, dto: UpsertQuestionDto) {
    await this.assertNotUsedByPublishedExam(id);
    const question = await this.questionModel.findByIdAndUpdate(
      id,
      { ...dto, subjectId: new Types.ObjectId(dto.subjectId) },
      { new: true, runValidators: true },
    );
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async remove(id: string) {
    await this.assertNotUsedByPublishedExam(id);
    const question = await this.questionModel.findByIdAndDelete(id);
    if (!question) throw new NotFoundException('Question not found');
    return { deleted: true };
  }

  private async assertNotUsedByPublishedExam(id: string) {
    const used = await this.examModel.exists({
      status: 'published',
      'sections.questionIds': new Types.ObjectId(id),
    });
    if (used) {
      throw new BadRequestException('Question is used by a published exam and cannot be edited or deleted');
    }
  }
}
