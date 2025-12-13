import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string; // We will handle hashing if this is present

  @IsOptional()
  branding?: {
    instituteName?: string;
    logoUrl?: string;
  };
}