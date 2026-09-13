import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class SaveAnswerDto {
  @IsMongoId()
  questionId!: string;

  @IsOptional()
  @IsString()
  answer?: string;
}
