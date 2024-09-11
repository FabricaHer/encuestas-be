import { Injectable } from '@nestjs/common';
import { AnswerPatientService } from 'src/answer-patient/services/answer-patient.service';

@Injectable()
export class StatisticsServices {
  constructor(private readonly answerPatientService: AnswerPatientService) {}

  async dataDashboard(startDate: string, endDate: string) {
    const dataChart = await this.answerPatientService.dataChart(
      new Date(startDate),
      new Date(endDate),
    );

    const lastAnswers = await this.answerPatientService.getLastAnswer(
      new Date(startDate),
      new Date(endDate),
    );
    const totalAnswer = await this.answerPatientService.getTotalAnswer(
      new Date(startDate),
      new Date(endDate),
    );
    const averageAnswers = await this.answerPatientService.getAverage(
      new Date(startDate),
      new Date(endDate),
    );

    return {
      averageAnswers,
      totalAnswer,
      dataChart,
      lastAnswers,
    };
  }
}
