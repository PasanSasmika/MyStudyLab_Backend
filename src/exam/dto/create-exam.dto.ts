import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  correctIndex: number;

  @IsNumber()
  marks: number;
}

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsDateString()
  startTime: string; // ISO Date String

  @IsNumber()
  @Min(5)
  durationMinutes: number;

  @IsArray()
  @ValidateNested({ each: true }) // Validates every question in the array
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}