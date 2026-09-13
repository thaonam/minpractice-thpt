import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttemptResultDocument = HydratedDocument<AttemptResult>;

@Schema({ _id: false })
export class AttemptResultOption {
  @Prop({ required: true })
  key!: string;

  @Prop({ required: true })
  content!: string;
}

@Schema({ _id: false })
export class AttemptResultDetail {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop()
  type?: string;

  @Prop()
  content?: string;

  @Prop({ type: [AttemptResultOption], default: [] })
  options!: AttemptResultOption[];

  @Prop()
  userAnswer?: string;

  @Prop({ required: true })
  correctAnswer!: string;

  @Prop({ required: true })
  isCorrect!: boolean;

  @Prop()
  explanation?: string;
}

@Schema({ timestamps: true })
export class AttemptResult {
  @Prop({ type: Types.ObjectId, ref: 'Attempt', required: true, unique: true })
  attemptId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true, index: true })
  examId!: Types.ObjectId;

  @Prop({ required: true })
  score!: number;

  @Prop({ required: true })
  totalQuestions!: number;

  @Prop({ required: true })
  correctCount!: number;

  @Prop({ required: true })
  wrongCount!: number;

  @Prop({ required: true })
  blankCount!: number;

  @Prop({ type: [AttemptResultDetail], default: [] })
  details!: AttemptResultDetail[];
}

export const AttemptResultSchema = SchemaFactory.createForClass(AttemptResult);
