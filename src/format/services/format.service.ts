import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ParseBoolPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatResponse, getSkip } from 'src/utils/functions/paginated';
import { FormatResponse } from 'src/utils/models/paginated.model';
import { ILike, Repository, FindManyOptions } from 'typeorm';
import { CreateFormatDto } from '../dto/create-format.dto';
import { UpdateFormatDto } from '../dto/update-format.dto';
import { Format } from '../entities/format.entity';

@Injectable()
export class FormatService {
  constructor(
    @InjectRepository(Format)
    private readonly formatRepo: Repository<Format>,
  ) {}

  async create(args: CreateFormatDto) {
    try {
      const format = await this.formatRepo.findOne({
        where: {
          name: args.name,
        },
      });
      if (format) {
        throw new BadRequestException('Formato ya existente');
      }
      const formatCreated = await this.formatRepo.save(args);
      return formatResponse(formatCreated);
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    status = null,
    search = null,
  ): Promise<FormatResponse<Format>> {
    const skip = getSkip(limit, page);
    const options: FindManyOptions<Format> = {
      where: {
        name: ILike(`%${search ? search : ''}%`),
      },
      relations: { questions: { subQuestion: { answers: true } } },
      skip,
      take: limit,
    };

    if (status) {
      options.where = {
        ...options.where,
        status: await new ParseBoolPipe().transform(status, { type: 'query' }),
      };
    }
    const [format, total] = await this.formatRepo.findAndCount(options);

    return formatResponse(format, page, limit, total);
  }

  async findOne(id: number) {
    const response = await this.formatRepo.findOne({
      where: { id },
      relations: { questions: { subQuestion: { answers: true }, area: true } },
      order: {
        questions: {
          id: 'ASC',
          subQuestion: {
            id: 'ASC',
          },
        },
      },
    });
    if (!response) {
      throw new NotFoundException('formato no encontrado');
    }
    return response;
  }

  exists(id: number) {
    return this.formatRepo.existsBy({ id });
  }

  async getFormatByBed(bed_id: string) {
    let format = await this.formatRepo.findOne({
      where: {
        bed_id,
        status: true,
      },
      relations: {
        questions: {
          subQuestion: {
            answers: true,
          },
        },
      },
    });
    if (format) {
      return format;
    }

    format = await this.formatRepo.findOne({
      where: {
        isForAll: true,
        status: true,
      },
      relations: {
        questions: {
          subQuestion: {
            answers: true,
          },
        },
      },
    });
    return format;
  }
  async update(id: number, args: UpdateFormatDto) {
    try {
      const format = await this.formatRepo.findOneBy({ id });

      if (!format) {
        throw new NotFoundException('Formato no encontrado');
      }
      const formatUpdated = Object.assign(format, args);
      await this.formatRepo.update({ id }, formatUpdated);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const format = await this.formatRepo.findOneBy({ id });

      if (!format) {
        throw new NotFoundException('Formato no encontrado');
      }
      await this.formatRepo.softRemove(format);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }
}
