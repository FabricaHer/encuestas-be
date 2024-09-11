import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaService } from 'src/area/services/area.service';
import { FormatService } from 'src/format/services/format.service';
import { Transaction } from 'src/utils/decorators/Transaction';
import { formatResponse, getSkip } from 'src/utils/functions/paginated';
import { QueryRunner, Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { Question } from '../entities/question.entity';
import { SubQuestionService } from './sub-question.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly formatService: FormatService,
    private readonly subQuestionService: SubQuestionService,
    private readonly areaService: AreaService,
  ) {}

  @Transaction()
  async create(args: CreateQuestionDto[], queryRunner?: QueryRunner) {
    try {
      if (args.length <= 0) {
        throw new BadRequestException('El array no puede ser vacio');
      }

      const promises = args.map(async (question) => {
        const format = await this.formatService.findOne(question.format);
        const area = await this.areaService.findOne(question.areaId);
        const questionCreated = this.questionRepo.create({
          ...question,
          format,
          area,
        });
        const newQuestion = await queryRunner.manager.save(
          Question,
          questionCreated,
        );
        if (question?.subQuestion?.length > 0) {
          await this.subQuestionService.createWithQueryRunner(
            queryRunner,
            question.subQuestion,
            newQuestion,
          );
        }
      });

      await Promise.all(promises);
      return {
        status: 'ok',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(formatId: number, page: number, limit: number) {
    const skip = getSkip(limit, page);
    const [format, total] = await this.questionRepo.findAndCount({
      where: {
        format: {
          id: formatId,
        },
      },
      skip,
      take: limit,
    });

    return formatResponse(format, page, limit, total);
  }

  findOne(id: number) {
    return this.questionRepo.findOneBy({ id });
  }

  async update(id: number, args: UpdateQuestionDto) {
    try {
      const format = await this.questionRepo.findOneBy({ id });

      if (!format) {
        throw new NotFoundException('Formato no encontrado');
      }
      const formatUpdated = Object.assign(format, args);
      await this.questionRepo.save(formatUpdated);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const question = await this.questionRepo.findOneBy({ id });

      if (!question) {
        throw new NotFoundException('pregunta no encontrada');
      }
      await this.questionRepo.softRemove(question);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }
}
