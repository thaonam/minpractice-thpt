import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ _id: false })
export class QuestionOption {
  @Prop({ required: true })
  key!: string;

  @Prop({ required: true })
  content!: string;
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true, index: true })
  subjectId!: Types.ObjectId;

  @Prop({ required: true, enum: ['single_choice', 'true_false', 'short_answer'] })
  type!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: [QuestionOption], default: [] })
  options!: QuestionOption[];

  @Prop({ required: true })
  correctAnswer!: string;

  @Prop()
  explanation?: string;

  @Prop({ default: 'medium', enum: ['easy', 'medium', 'hard'] })
  difficulty!: string;

  @Prop({ default: [] })
  tags!: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
