import { IsNotEmpty } from 'class-validator';

export class AnswerDto {
  @IsNotEmpty()
  description: string;
}
