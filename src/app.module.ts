import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormatModule } from './format/format.module';
import { DatabasesModule } from './databases/databases.module';
import { configModule } from './config/config.module';
import { DpadmwinModule } from './dpadmwin/dpadmwin.module';
import { QuestionModule } from './question/question.module';
import { AreaModule } from './area/area.module';
import { AnswerPatientModule } from './answer-patient/answer-patient.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    FormatModule,
    DatabasesModule,
    configModule,
    DpadmwinModule,
    QuestionModule,
    AreaModule,
    AnswerPatientModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
