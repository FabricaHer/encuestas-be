import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAnswerPatientDto {
  @IsNotEmpty()
  @IsString()
  admissionId: string;

  @IsNotEmpty()
  @IsString()
  bedId: string;

  @IsNumber()
  @IsNotEmpty()
  format: number;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsArray()
  answers: AnswersPatientDto[];

  @IsDateString()
  @IsOptional()
  createdAt?: string;
}

export class AnswersPatientDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(4)
  qualification: number;

  @IsNotEmpty()
  @IsNumber()
  subQuestion: number;
}
