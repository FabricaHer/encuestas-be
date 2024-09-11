import { Controller, Get, Query } from '@nestjs/common';
import { QueryStatisticsDto } from '../dto/queryStatistics.dto';
import { StatisticsServices } from '../services/statistics.service';

@Controller('statistic')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsServices) {}

  @Get()
  getStatics(@Query() query: QueryStatisticsDto) {
    return this.statisticsService.dataDashboard(query.startDate, query.endDate);
  }
}
