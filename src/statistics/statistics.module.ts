import { Module } from '@nestjs/common';
import { AnswerPatientModule } from 'src/answer-patient/answer-patient.module';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsServices } from './services/statistics.service';

@Module({
  imports: [AnswerPatientModule],
  providers: [StatisticsServices],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
