import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerPatientDto } from './create-answer-patient.dto';

export class UpdateAnswerPatientDto extends PartialType(CreateAnswerPatientDto) {}
