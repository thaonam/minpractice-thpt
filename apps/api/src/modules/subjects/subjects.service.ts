import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from '../../database/schemas/subject.schema';
import { UpsertSubjectDto } from './dto/upsert-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(@InjectModel(Subject.name) private readonly subjectModel: Model<Subject>) {}

  findActive() {
    return this.subjectModel.find({ status: 'active' }).sort({ order: 1, name: 1 }).lean();
  }

  findAll() {
    return this.subjectModel.find().sort({ order: 1, name: 1 }).lean();
  }

  create(dto: UpsertSubjectDto) {
    return this.subjectModel.create({
      ...dto,
      code: dto.code.trim().toLowerCase(),
      name: dto.name.trim(),
    });
  }

  async update(id: string, dto: UpsertSubjectDto) {
    const subject = await this.subjectModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        code: dto.code.trim().toLowerCase(),
        name: dto.name.trim(),
      },
      { new: true, runValidators: true },
    );
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async remove(id: string) {
    const subject = await this.subjectModel.findByIdAndDelete(id);
    if (!subject) throw new NotFoundException('Subject not found');
    return { deleted: true };
  }
}
