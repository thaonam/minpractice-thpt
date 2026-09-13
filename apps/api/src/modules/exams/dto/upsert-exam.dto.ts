import { Type } from 'class-transformer';
import { IsArray, IsIn, IsMongoId, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class ExamSectionDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsMongoId({ each: true })
  questionIds!: string[];
}

export class UpsertExamDto {
  @IsMongoId()
  subjectId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  examType?: string;

  @IsString()
  grade!: string;

  @IsNumber()
  @Min(1)
  durationMinutes!: number;

  @IsNumber()
  @Min(0)
  totalScore!: number;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamSectionDto)
  sections!: ExamSectionDto[];
}
