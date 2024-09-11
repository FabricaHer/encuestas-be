import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubQuestionDto } from '../dto/create-sub-question.dto';
import { Question } from '../entities/question.entity';
import { SubQuestion } from '../entities/sub-question.entity';
import { AnswerService } from './answer.service';

@Injectable()
export class SubQuestionService {
  constructor(
    @InjectRepository(SubQuestion)
    private readonly subQuestionRepo: Repository<SubQuestion>,
    private readonly answerService: AnswerService,
  ) {}

  async createWithQueryRunner(
    queryRunner: QueryRunner,
    args: SubQuestionDto[],
    question: Question,
  ) {
    const promises = args.map(async (subQuestion) => {
      const subQuestionCreated = this.subQuestionRepo.create({
        ...subQuestion,
        question,
      });

      const newSubQuestion = await queryRunner.manager.save(
        SubQuestion,
        subQuestionCreated,
      );

      if (subQuestion?.answers?.length > 0) {
        await this.answerService.createAnswerWithQueryRunner(
          queryRunner,
          subQuestion.answers,
          newSubQuestion,
        );
      }
    });
    Promise.all(promises);
  }

  findOne(id: number) {
    return this.subQuestionRepo.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    try {
      const subQuestion = await this.subQuestionRepo.findOneBy({ id });

      if (!subQuestion) {
        throw new NotFoundException('sub-pregunta no encontrada');
      }
      await this.subQuestionRepo.softRemove(subQuestion);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }
}
