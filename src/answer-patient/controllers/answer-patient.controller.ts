import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findOne(@Param('id') id: string) {
    return this.answerPatientService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnswerPatientDto: UpdateAnswerPatientDto,
  ) {
    return this.answerPatientService.update(+id, updateAnswerPatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerPatientService.remove(+id);
  }
}
