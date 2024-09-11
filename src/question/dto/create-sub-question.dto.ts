import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { TypeSubQuestion } from '../enums/Type.enum';
import { AnswerDto } from './create-answer.dto';

export class SubQuestionDto {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isAvailableForReport?: boolean;

  @IsOptional()
  @IsEnum(TypeSubQuestion)
  type?: TypeSubQuestion;

  @IsArray({ each: true })
  answers: AnswerDto[];
}
