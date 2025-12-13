import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinBatchDto {
  @IsNotEmpty()
  @IsString()
  // Our codes will be exactly 6 characters usually, but let's allow flexibility
  @Length(4, 10, { message: 'Batch code is invalid' })
  code: string;
}