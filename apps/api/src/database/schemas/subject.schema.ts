import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, unique: true, trim: true })
  code!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: [] })
  gradeRange!: string[];

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status!: string;

  @Prop({ default: 0 })
  order!: number;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
