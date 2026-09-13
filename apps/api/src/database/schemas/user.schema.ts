import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ default: 'student', enum: ['student', 'admin', 'content_editor'] })
  role!: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'blocked'] })
  status!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
