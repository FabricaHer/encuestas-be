import { Module } from '@nestjs/common';
import { AnswerPatientService } from './services/answer-patient.service';
import { AnswerPatientController } from './controllers/answer-patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerPatient } from './entities/answer-patient.entity';
import { AnswersPatient } from './entities/answers-patient.entity';
import { Comment } from './entities/comment.entity';
import { FormatModule } from 'src/format/format.module';
import { QuestionModule } from 'src/question/question.module';
import { AreaModule } from 'src/area/area.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerPatient, AnswersPatient, Comment]),
    FormatModule,
    QuestionModule,
    AreaModule,
  ],
  controllers: [AnswerPatientController],
  providers: [AnswerPatientService],
  exports: [AnswerPatientService],
})
export class AnswerPatientModule {}
