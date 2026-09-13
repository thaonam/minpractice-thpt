import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from '../../database/schemas/exam.schema';
import { Question, QuestionSchema } from '../../database/schemas/question.schema';
import { AuthModule } from '../auth/auth.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Exam.name, schema: ExamSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
