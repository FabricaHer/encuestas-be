import { Controller, Delete, Param } from '@nestjs/common';
import { SubQuestionService } from '../services/sub-question.service';

@Controller('subquestion')
export class SubQuestionController {
  constructor(private readonly subQuestionService: SubQuestionService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subQuestionService.remove(+id);
  }
}
