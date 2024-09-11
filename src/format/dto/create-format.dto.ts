import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class CreateFormatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  bed: string;

  @IsOptional()
  @IsBoolean()
  isForAll: boolean;
}
