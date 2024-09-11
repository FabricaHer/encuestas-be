import { Module } from '@nestjs/common';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { SubQuestion } from './entities/sub-question.entity';
import { FormatModule } from 'src/format/format.module';
import { Answer } from './entities/answer.entity';
import { SubQuestionService } from './services/sub-question.service';
import { AnswerService } from './services/answer.service';
import { AreaModule } from 'src/area/area.module';
import { SubQuestionController } from './controllers/subQuestion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, SubQuestion, Answer]),
    FormatModule,
    AreaModule,
  ],
  controllers: [QuestionController, SubQuestionController],
  providers: [QuestionService, SubQuestionService, AnswerService],
  exports: [QuestionService, SubQuestionService, AnswerService],
})
export class QuestionModule {}
