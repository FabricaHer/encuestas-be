import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { IsFormatValid } from 'src/format/validations/is-format-valid';
import { SubQuestion } from '../entities/sub-question.entity';
import { SubQuestionDto } from './create-sub-question.dto';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsFormatValid()
  format: number;

  @IsNotEmpty()
  areaId: number;

  @IsArray()
  @IsObject({ each: true })
  subQuestion: SubQuestionDto[];
}
