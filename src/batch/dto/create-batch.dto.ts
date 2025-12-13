import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Batch name must be at least 3 characters' })
  name: string;
}