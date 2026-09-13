import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttemptDocument = HydratedDocument<Attempt>;

@Schema({ _id: false })
export class AttemptAnswer {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop()
  answer?: string;

  @Prop()
  answeredAt?: Date;
}

@Schema({ timestamps: true })
export class Attempt {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true, index: true })
  examId!: Types.ObjectId;

  @Prop({ default: 'in_progress', enum: ['in_progress', 'submitted', 'expired'], index: true })
  status!: string;

  @Prop({ required: true })
  startedAt!: Date;

  @Prop()
  submittedAt?: Date;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ type: [AttemptAnswer], default: [] })
  answers!: AttemptAnswer[];

  @Prop()
  score?: number;

  @Prop({ default: 0 })
  correctCount!: number;

  @Prop({ default: 0 })
  wrongCount!: number;

  @Prop({ default: 0 })
  blankCount!: number;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
