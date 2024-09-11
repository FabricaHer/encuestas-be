import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatResponse, getSkip } from 'src/utils/functions/paginated';
import { QueryRunner, Repository } from 'typeorm';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area) private readonly areaRepo: Repository<Area>,
  ) {}

  async create(args: CreateAreaDto) {
    const { description } = args;
    try {
      const area = await this.areaRepo.exists({
        where: { description },
      });
      if (area) {
        throw new BadRequestException('Area ya existente');
      }
      const newArea = await this.areaRepo.save(args);

      return formatResponse(newArea);
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number, limit: number) {
    const skip = getSkip(limit, page);

    const [format, total] = await this.areaRepo.findAndCount({
      skip,
      take: limit,
    });

    return formatResponse(format, page, limit, total);
  }

  async find() {
    return this.areaRepo.find({
      where: {
        status: true,
      },
    });
  }

  findOne(id: number) {
    return this.areaRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, args: UpdateAreaDto) {
    try {
      const area = await this.areaRepo.findOneBy({ id });

      if (!area) {
        throw new NotFoundException('area no encontrada');
      }
      const formatUpdated = Object.assign(area, args);
      await this.areaRepo.save(formatUpdated);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }

  findActives() {
    return this.areaRepo.find({
      where: {
        status: true,
      },
    });
  }

  async remove(id: number) {
    try {
      const format = await this.areaRepo.findOneBy({ id });

      if (!format) {
        throw new NotFoundException('Formato no encontrado');
      }
      await this.areaRepo.softRemove(format);
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }
}
