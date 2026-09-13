import { config } from 'dotenv';
import mongoose, { Types } from 'mongoose';
import { ExamSchema } from './database/schemas/exam.schema';
import { QuestionSchema } from './database/schemas/question.schema';
import { SubjectSchema } from './database/schemas/subject.schema';

config();

const SubjectModel = mongoose.model('Subject', SubjectSchema);
const QuestionModel = mongoose.model('Question', QuestionSchema);
const ExamModel = mongoose.model('Exam', ExamSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  await mongoose.connect(uri);

  const math = await SubjectModel.findOneAndUpdate(
    { code: 'math' },
    { code: 'math', name: 'Toan', gradeRange: ['12'], status: 'active', order: 1 },
    { upsert: true, new: true },
  );

  const english = await SubjectModel.findOneAndUpdate(
    { code: 'english' },
    { code: 'english', name: 'Tieng Anh', gradeRange: ['12'], status: 'active', order: 2 },
    { upsert: true, new: true },
  );

  const questions = await QuestionModel.insertMany([
    {
      subjectId: math._id,
      type: 'single_choice',
      content: 'Neu x + y = 10 va x - y = 4, gia tri cua x la bao nhieu?',
      options: [
        { key: 'A', content: '3' },
        { key: 'B', content: '5' },
        { key: 'C', content: '7' },
        { key: 'D', content: '10' },
      ],
      correctAnswer: 'C',
      explanation: 'Cong hai phuong trinh: 2x = 14 nen x = 7.',
      difficulty: 'easy',
      tags: ['dai-so'],
    },
    {
      subjectId: math._id,
      type: 'single_choice',
      content: 'Ham so f(x) = 2x^2 - 3x + 1. Gia tri f(-2) la bao nhieu?',
      options: [
        { key: 'A', content: '9' },
        { key: 'B', content: '12' },
        { key: 'C', content: '15' },
        { key: 'D', content: '18' },
      ],
      correctAnswer: 'C',
      explanation: 'f(-2) = 2*4 - 3*(-2) + 1 = 8 + 6 + 1 = 15.',
      difficulty: 'easy',
      tags: ['ham-so'],
    },
  ]);

  await ExamModel.findOneAndUpdate(
    { title: 'De thi thu THPT 2026 - Mon Toan - De 01' },
    {
      subjectId: math._id,
      title: 'De thi thu THPT 2026 - Mon Toan - De 01',
      examType: 'thpt_graduation',
      grade: '12',
      durationMinutes: 90,
      totalScore: 10,
      status: 'published',
      sections: [
        {
          title: 'Phan I',
          description: 'Trac nghiem',
          questionIds: questions.map((question) => question._id as Types.ObjectId),
        },
      ],
      publishedAt: new Date(),
    },
    { upsert: true },
  );

  await ExamModel.findOneAndUpdate(
    { title: 'De thi thu THPT 2026 - Mon Tieng Anh - De 01' },
    {
      subjectId: english._id,
      title: 'De thi thu THPT 2026 - Mon Tieng Anh - De 01',
      examType: 'thpt_graduation',
      grade: '12',
      durationMinutes: 60,
      totalScore: 10,
      status: 'published',
      sections: [],
      publishedAt: new Date(),
    },
    { upsert: true },
  );

  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
