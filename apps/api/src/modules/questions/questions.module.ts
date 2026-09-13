import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from '../../database/schemas/exam.schema';
import { Question, QuestionSchema } from '../../database/schemas/question.schema';
import { AuthModule } from '../auth/auth.module';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Exam.name, schema: ExamSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
