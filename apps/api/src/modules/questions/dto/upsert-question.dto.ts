import { Type } from 'class-transformer';
import { IsArray, IsIn, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';

class QuestionOptionDto {
  @IsString()
  key!: string;

  @IsString()
  content!: string;
}

export class UpsertQuestionDto {
  @IsMongoId()
  subjectId!: string;

  @IsIn(['single_choice', 'true_false', 'short_answer'])
  type!: string;

  @IsString()
  content!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options!: QuestionOptionDto[];

  @IsString()
  correctAnswer!: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
