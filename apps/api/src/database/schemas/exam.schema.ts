import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ _id: false })
export class ExamSection {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Question', default: [] })
  questionIds!: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Exam {
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true, index: true })
  subjectId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ default: 'thpt_graduation' })
  examType!: string;

  @Prop({ required: true })
  grade!: string;

  @Prop({ required: true })
  durationMinutes!: number;

  @Prop({ required: true })
  totalScore!: number;

  @Prop({ default: 'draft', enum: ['draft', 'published', 'archived'], index: true })
  status!: string;

  @Prop({ type: [ExamSection], default: [] })
  sections!: ExamSection[];

  @Prop()
  publishedAt?: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
