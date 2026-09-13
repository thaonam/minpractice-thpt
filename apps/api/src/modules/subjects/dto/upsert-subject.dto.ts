import { IsArray, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpsertSubjectDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  gradeRange!: string[];

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
