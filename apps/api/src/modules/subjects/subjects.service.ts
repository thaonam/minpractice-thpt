import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from '../../database/schemas/subject.schema';

@Injectable()
export class SubjectsService {
  constructor(@InjectModel(Subject.name) private readonly subjectModel: Model<Subject>) {}

  findActive() {
    return this.subjectModel.find({ status: 'active' }).sort({ order: 1, name: 1 }).lean();
  }
}
