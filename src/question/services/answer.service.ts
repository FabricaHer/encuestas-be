import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { AnswerDto } from '../dto/create-answer.dto';
import { Answer } from '../entities/answer.entity';
import { SubQuestion } from '../entities/sub-question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}

  async createAnswerWithQueryRunner(
    queryRunner: QueryRunner,
    answers: AnswerDto[],
    subQuestion: SubQuestion,
  ) {
    const answerCreated = answers.map((answer) => ({ ...answer, subQuestion }));
    await queryRunner.manager.save(Answer, answerCreated);
  }
}
