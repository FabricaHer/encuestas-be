import { IsDateString, IsNotEmpty } from 'class-validator';

export class QueryStatisticsDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
