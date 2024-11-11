import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AnswerPatientService } from '../services/answer-patient.service';
import { CreateAnswerPatientDto } from '../dto/create-answer-patient.dto';
import { UpdateAnswerPatientDto } from '../dto/update-answer-patient.dto';

@Controller('answer-patient')
export class AnswerPatientController {
  constructor(private readonly answerPatientService: AnswerPatientService) {}

  @Post()
  create(@Body() createAnswerPatientDto: CreateAnswerPatientDto) {
    return this.answerPatientService.create(createAnswerPatientDto);
  }

  @Get(':id')
  getByAdmission(@Param('id') id: string) {
    return this.answerPatientService.findByAdmission(id);
  }
  @Get()
  findAll(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.answerPatientService.getAnswers(limit, page);
  }
}
