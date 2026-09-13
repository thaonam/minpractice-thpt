import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptResult, AttemptResultSchema } from '../../database/schemas/attempt-result.schema';
import { Attempt, AttemptSchema } from '../../database/schemas/attempt.schema';
import { Exam, ExamSchema } from '../../database/schemas/exam.schema';
import { Question, QuestionSchema } from '../../database/schemas/question.schema';
import { AuthModule } from '../auth/auth.module';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { GradingService } from './grading.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Attempt.name, schema: AttemptSchema },
      { name: AttemptResult.name, schema: AttemptResultSchema },
      { name: Exam.name, schema: ExamSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [AttemptsController],
  providers: [AttemptsService, GradingService],
})
export class AttemptsModule {}
